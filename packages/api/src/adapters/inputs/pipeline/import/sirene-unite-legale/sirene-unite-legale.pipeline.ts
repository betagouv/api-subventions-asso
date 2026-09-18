import { Readable, Transform, Writable } from "stream";
import { pipeline } from "stream/promises";

import { ImportReport } from "../../../../../@types/ImportReport";
import { SireneUniteLegaleEntity } from "../../../../../entities/SireneUniteLegaleEntity";
import { UniteLegaleEntrepriseEntity } from "../../../../../entities/UniteLegaleEntrepriseEntity";
import Siren from "../../../../../identifier-objects/Siren";
import SireneUniteLegaleDto from "./SireneUniteLegaleDto";
import uniteLegaleEntrepriseService, {
    UniteLegaleEntrepriseService,
} from "../../../../../modules/providers/unite-legale-entreprise/unite-legale.entreprise.service";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import sireneUniteLegaleAdapter from "../../../../outputs/db/sirene/sirene-unite-legale.adapter";
import { SireneUniteLegalePort } from "../../../../outputs/db/sirene/sirene-unite-legale.port";
import parquetParser, { ParquetParser, ParquetRow } from "../../../parquet.parser";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import associationSearchAdapter from "../../../../outputs/db/association-search/association-search.adapter";
import SireneUniteLegaleMapper from "./sirene-unite-legale.mapper";

export class SireneUniteLegalePipeline {
    constructor(
        private parser: ParquetParser,
        private sirenePort: SireneUniteLegalePort,
        private searchPort: AssociationSearchPort,
        private entrepriseService: UniteLegaleEntrepriseService,
    ) {}

    async run(filePath: string): Promise<ImportReport> {
        const report: ImportReport = { parsedCount: 0, importedCount: 0, errorCount: 0 };

        await pipeline([
            Readable.from(this.parser.parse(filePath)),
            new Transform({
                objectMode: true,
                transform: (batch: ParquetRow[], _encoding, callback) => {
                    report.parsedCount += batch.length;

                    try {
                        callback(null, this.toImportableEntities(batch));
                    } catch (error) {
                        callback(error as Error);
                    }
                },
            }),
            new Writable({
                objectMode: true,
                write: async (entities: SireneUniteLegaleEntity[], _encoding, callback) => {
                    try {
                        await this.saveBatch(entities);
                        report.importedCount += entities.length;
                        callback();
                    } catch (error) {
                        callback(error as Error);
                    }
                },
            }),
        ]);

        return report;
    }

    private toImportableEntities(batch: ParquetRow[]): SireneUniteLegaleEntity[] {
        return batch
            .filter(row => this.isImportable(row as unknown as SireneUniteLegaleDto))
            .map(row => SireneUniteLegaleMapper.parquetRowToEntity(row));
    }

    private isImportable(dto: SireneUniteLegaleDto): boolean {
        return dto.unitePurgeeUniteLegale !== true && Siren.isSiren(dto.siren);
    }

    private async saveBatch(entities: SireneUniteLegaleEntity[]): Promise<void> {
        const associations = entities.filter(entity => this.isAssociation(entity));
        const entreprises = entities.filter(entity => !this.isAssociation(entity));

        await Promise.all([this.saveAssociations(associations), this.saveEntreprises(entreprises)]);
    }

    private isAssociation(entity: SireneUniteLegaleEntity): boolean {
        return entity.categorieJuridiqueUniteLegale
            ? LEGAL_CATEGORIES_ACCEPTED.includes(entity.categorieJuridiqueUniteLegale)
            : false;
    }

    private async saveAssociations(entities: SireneUniteLegaleEntity[]): Promise<void> {
        if (!entities.length) return;

        await Promise.all([
            this.sirenePort.upsertMany(entities),
            this.searchPort.upsertMany(entities.map(entity => SireneUniteLegaleMapper.toAssociationSearch(entity))),
        ]);
    }

    private saveEntreprises(entities: SireneUniteLegaleEntity[]): Promise<void> {
        return this.entrepriseService.insertManyEntrepriseSiren(
            entities.map(entity => new UniteLegaleEntrepriseEntity(entity.siren)),
        );
    }
}

const sireneUniteLegalePipeline = new SireneUniteLegalePipeline(
    parquetParser,
    sireneUniteLegaleAdapter,
    associationSearchAdapter,
    uniteLegaleEntrepriseService,
);

export default sireneUniteLegalePipeline;
