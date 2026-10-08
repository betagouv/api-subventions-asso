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
import { ParquetParser } from "../../../parquet.parser";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import associationSearchAdapter from "../../../../outputs/db/association-search/association-search.adapter";
import sireneUniteLegaleMapper, { SireneUniteLegaleMapper } from "./sirene-unite-legale.mapper";
import { ImportPipeline } from "../import-pipeline";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";
import { addMonths } from "../../../../../shared/helpers/DateHelper";
import dataLogAdapter from "../../../../outputs/db/data-log/data-log.adapter";

export class SireneUniteLegalePipeline extends ImportPipeline {
    constructor(
        private parser: ParquetParser<SireneUniteLegaleDto>,
        private mapper: SireneUniteLegaleMapper,
        private sirenePort: SireneUniteLegalePort,
        private searchPort: AssociationSearchPort,
        private entrepriseService: UniteLegaleEntrepriseService,
        private logPort: DataLogPort,
    ) {
        super();
    }

    async run(filePath: string): Promise<ImportReport> {
        // import should occur each month
        // to be sure we don't miss somemthing between import date and dateDernierTraitementUniteLegale, we take one more month
        const lastImportDate = addMonths(await this.logPort.getLastImportByProvider("sirene-unite-legale"), -1);

        const stages: (Readable | Transform | Writable)[] = [Readable.from(this.parser.parse(filePath))];

        if (lastImportDate) {
            console.log(`Updating Stock Unité Légale since ${lastImportDate}`);
            stages.push(
                new Transform({
                    objectMode: true,
                    transform: (batch: SireneUniteLegaleDto[], _enc, callback) => {
                        try {
                            callback(
                                null,
                                batch.filter(dto => dto.dateDernierTraitementUniteLegale > lastImportDate),
                            );
                        } catch (err) {
                            callback(err as Error);
                        }
                    },
                }),
            );
        } else console.log("Starting first Stock Unité Légale importation");

        stages.push(
            new Transform({
                objectMode: true,
                transform: (batch: SireneUniteLegaleDto[], _encoding, callback) => {
                    this.report.parsedCount += batch.length;
                    console.log("batch size: ", batch.length);
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
                        this.report.importedCount += dtos.assos.length + dtos.companies.length;
                        callback();
                    } catch (error) {
                        callback(error as Error);
                    }
                },
            }),
        );

        await pipeline(stages);

        return this.report;
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

        const dbos = dtos.map(this.mapper.toDbo);

        await Promise.all([
            this.sirenePort.upsertMany(dbos),
            this.searchPort.upsertFromSirene(dbos.map(dbo => this.mapper.toAssociationSearch(dbo))),
        ]);
    }

    private saveEntreprises(dtos: SireneUniteLegaleDto[]): Promise<void> {
        return this.entrepriseService.insertManyEntrepriseSiren(
            dtos.map(dto => new UniteLegaleEntrepriseEntity(new Siren(dto.siren))),
        );
    }
}

const sireneUniteLegalePipeline = new SireneUniteLegalePipeline(
    new ParquetParser<SireneUniteLegaleDto>(),
    sireneUniteLegaleMapper,
    sireneUniteLegaleAdapter,
    associationSearchAdapter,
    uniteLegaleEntrepriseService,
    dataLogAdapter,
);

export default sireneUniteLegalePipeline;
