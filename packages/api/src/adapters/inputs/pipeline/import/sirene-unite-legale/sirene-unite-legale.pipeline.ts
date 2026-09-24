import { Readable, Transform, Writable } from "stream";
import { pipeline } from "stream/promises";

import { ImportReport } from "../../../../../@types/ImportReport";
import { UniteLegaleEntrepriseEntity } from "../../../../../entities/UniteLegaleEntrepriseEntity";
import Siren from "../../../../../identifier-objects/Siren";
import SireneUniteLegaleDto from "./SireneUniteLegaleDto";
import uniteLegaleEntrepriseService, {
    UniteLegaleEntrepriseService,
} from "../../../../../modules/providers/unite-legale-entreprise/unite-legale.entreprise.service";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import sireneUniteLegaleAdapter from "../../../../outputs/db/sirene/sirene-unite-legale.adapter";
import { SireneUniteLegalePort } from "../../../../outputs/db/sirene/sirene-unite-legale.port";
import parquetParser, { ParquetParser } from "../../../parquet.parser";
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
                transform: (batch: SireneUniteLegaleDto[], _encoding, callback) => {
                    report.parsedCount += batch.length;

                    try {
                        const importable = batch.filter(dto => this.isImportable(dto));
                        const [assos, companies] = importable.reduce(
                            ([assos, companies], dto) => {
                                if (this.isAssociation(dto)) assos.push(dto);
                                else companies.push(dto);
                                return [assos, companies];
                            },
                            [[], []] as SireneUniteLegaleDto[][],
                        );
                        callback(null, { assos, companies });
                    } catch (error) {
                        callback(error as Error);
                    }
                },
            }),
            new Writable({
                objectMode: true,
                write: async (
                    dtos: { assos: SireneUniteLegaleDto[]; companies: SireneUniteLegaleDto[] },
                    _encoding,
                    callback,
                ) => {
                    try {
                        await Promise.all([this.saveAssociations(dtos.assos), this.saveEntreprises(dtos.companies)]);
                        report.importedCount += dtos.assos.length + dtos.companies.length;
                        callback();
                    } catch (error) {
                        callback(error as Error);
                    }
                },
            }),
        ]);

        return report;
    }

    private isImportable(dto: SireneUniteLegaleDto): boolean {
        return dto.unitePurgeeUniteLegale !== true && Siren.isSiren(dto.siren);
    }

    private isAssociation(dto: SireneUniteLegaleDto): boolean {
        return dto.categorieJuridiqueUniteLegale
            ? LEGAL_CATEGORIES_ACCEPTED.includes(String(dto.categorieJuridiqueUniteLegale))
            : false;
    }

    private async saveAssociations(dtos: SireneUniteLegaleDto[]): Promise<void> {
        if (!dtos.length) return;

        const dbos = dtos.map(SireneUniteLegaleMapper.toDbo);

        await Promise.all([
            this.sirenePort.upsertMany(dbos),
            this.searchPort.upsertMany(dbos.map(dbo => SireneUniteLegaleMapper.toAssociationSearch(dbo))),
        ]);
    }

    private saveEntreprises(dtos: SireneUniteLegaleDto[]): Promise<void> {
        return this.entrepriseService.insertManyEntrepriseSiren(
            dtos.map(dto => new UniteLegaleEntrepriseEntity(new Siren(dto.siren))),
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
