import { ImportReport } from "../../../../../@types/ImportReport";
import sireneEstablishmentAdapter from "../../../../outputs/db/sirene/sirene-establishment.adapter";
import { SireneEstablishmentPort } from "../../../../outputs/db/sirene/sirene-establishment.port";
import SireneEstablishmentDto from "./sirene-establishment.dto";
import dataLogAdapter from "../../../../outputs/db/data-log/data-log.adapter";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import associationSearchAdapter from "../../../../outputs/db/association-search/association-search.adapter";
import AssociationSearchDbo from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { SireneEstablishmentMapper } from "./sirene-establishment.mapper";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";
import { ImportPipeline } from "../import-pipeline";
import { addMonths } from "../../../../../shared/helpers/DateHelper";
import { ParquetParser } from "../../../parquet.parser";
import { Readable, Transform, Writable } from "stream";
import { pipeline } from "stream/promises";
import { SireneUniteLegalePort } from "../../../../outputs/db/sirene/sirene-unite-legale.port";
import sireneUniteLegaleAdapter from "../../../../outputs/db/sirene/sirene-unite-legale.adapter";

const SIRENE_ESTABLISHMENT_PROVIDER_ID = "sirene-establishment";

type MostRecentUpdatesFields = Pick<
    SireneEstablishmentDto,
    | "siren"
    | "numeroVoieEtablissement"
    | "typeVoieEtablissement"
    | "libelleVoieEtablissement"
    | "libelleCommuneEtablissement"
    | "codePostalEtablissement"
    | "dateDernierTraitementEtablissement"
>;

type FullOrUpdateEstab = Partial<SireneEstablishmentDto> & MostRecentUpdatesFields;

export class SireneEstablishmentPipeline extends ImportPipeline {
    constructor(
        private parser: ParquetParser<SireneEstablishmentDto>,
        private establishmentPort: SireneEstablishmentPort,
        private uniteLegalePort: SireneUniteLegalePort,
        private searchPort: AssociationSearchPort,
        private logAdapter: DataLogPort,
    ) {
        super();
    }

    public async run(filePath: string): Promise<ImportReport> {
        // import should occur each month, we secure by taking one more month to be sure to take all new data
        const lastEditionDate = addMonths(
            await this.logAdapter.getLastEditionDateByProvider(SIRENE_ESTABLISHMENT_PROVIDER_ID),
            -1,
        );

        const stages: (Readable | Transform | Writable)[] = [Readable.from(this.parser.parse(filePath))];

        if (lastEditionDate) {
            console.log(`Updating Sirene Stock Etablissement since ${lastEditionDate}`);
            stages.push(
                new Transform({
                    objectMode: true,
                    transform: (batch: SireneEstablishmentDto[], _enc, callback) => {
                        try {
                            callback(
                                null,
                                batch.filter(dto => new Date(dto.dateDernierTraitementEtablissement) > lastEditionDate),
                            );
                        } catch (err) {
                            callback(err as Error);
                        }
                    },
                }),
            );
        } else console.log("Starting first Sirene Stock Etablissement importation");

        const mostRecentUpdates: MostRecentUpdatesFields[] = [];

        stages.push(
            new Writable({
                objectMode: true,
                write: async (batch: SireneEstablishmentDto[], _enc, callback) => {
                    try {
                        this.report.parsedCount += batch.length;

                        const associationDtos = await this.filterAssociationEstablishments(batch);

                        if (associationDtos.length === 0) {
                            return callback();
                        }

                        const mostRecentDtos = this.filterMostRecent(associationDtos);

                        mostRecentUpdates.push(...this.filterMainEstab(mostRecentDtos));

                        this.report.importedCount += await this.establishmentPort.upsertMany(mostRecentDtos);
                        callback();
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
        );

        await pipeline(stages);

        await this.updateAssociationSearch(
            // reapply the filter on the whole array after each batch did the same internally
            this.filterMostRecent(mostRecentUpdates).map(dto => SireneEstablishmentMapper.toAssociationSearch(dto)),
        );

        return this.report;
    }

    private async updateAssociationSearch(mostRecentUpdates: Pick<AssociationSearchDbo, "siren" | "address">[]) {
        const CHUNK_SIZE = 10000;

        console.log(`starting upserting ${mostRecentUpdates.length} association-search...`);

        for (let i = 0; i < mostRecentUpdates.length; i += CHUNK_SIZE) {
            console.time("chunk");
            // const tmpAssociationSearch = await this.searchPort.getTmpCollection();

            const chunk = mostRecentUpdates.slice(i, i + CHUNK_SIZE);

            // Should not have duplicate siren as it is already handled by filterMostRecent
            const mainEstabUpdateMap = new Map(chunk.map(dbo => [dbo.siren, dbo]));

            const iterable = this.establishmentPort.getComputedFields(chunk.map(dbo => dbo.siren));

            const associationSearch: Partial<
                Pick<AssociationSearchDbo, "siren" | "address" | "nbEstabs" | "postalCodes">
            >[] = [];

            // affecte main estab address updates in each AssociationSearch received from getComputedField
            for await (const item of iterable) {
                const match = mainEstabUpdateMap.get(item.siren);
                if (match) Object.assign(item, match);
                associationSearch.push(item);
            }

            await this.searchPort.upsertMany(associationSearch);
            console.timeEnd("chunk");
        }
    }

    // Returns partial main establishment dtos use to create association-search
    private filterMainEstab(dtos: SireneEstablishmentDto[]) {
        // for each group filter main and update address
        const updates: MostRecentUpdatesFields[] = [];
        for (const dto of dtos) {
            if (dto.etablissementSiege)
                updates.push({
                    siren: dto.siren,
                    numeroVoieEtablissement: dto.numeroVoieEtablissement,
                    typeVoieEtablissement: dto.typeVoieEtablissement,
                    libelleVoieEtablissement: dto.libelleVoieEtablissement,
                    libelleCommuneEtablissement: dto.libelleCommuneEtablissement,
                    codePostalEtablissement: dto.codePostalEtablissement,
                    dateDernierTraitementEtablissement: dto.dateDernierTraitementEtablissement,
                });
        }

        return updates;
    }

    // Filter same siren dto inside a batch to avoid upsert twice for nothing
    private filterMostRecent(dtos: FullOrUpdateEstab[]): SireneEstablishmentDto[] {
        const groupBySiren = dtos.reduce((map, dto) => {
            const group = map.get(dto.siren);
            if (!group) map.set(dto.siren, [dto]);
            else map.set(dto.siren, [...group, dto]);
            return map;
        }, new Map<string, FullOrUpdateEstab[]>());
        return [...groupBySiren.values()].map(group => this.getMostRecentDto(group) as SireneEstablishmentDto);
    }

    private getMostRecentDto(dtos: FullOrUpdateEstab[]) {
        if (!dtos.length) return null;
        if (dtos.length === 1) return dtos[0];
        return dtos.reduce((max, current) => {
            return current.dateDernierTraitementEtablissement > max.dateDernierTraitementEtablissement ? current : max;
        }) as SireneEstablishmentDto;
    }

    private extractSirens(batch: SireneEstablishmentDto[]): string[] {
        return [...new Set(batch.map(dto => dto.siren))];
    }

    private async filterAssociationEstablishments(batch: SireneEstablishmentDto[]): Promise<SireneEstablishmentDto[]> {
        const existingSirens = new Set(await this.uniteLegalePort.filterExistingSirens(this.extractSirens(batch)));
        return batch.filter(dto => existingSirens.has(dto.siren));
    }
}

const sireneEstablishmentPipeline = new SireneEstablishmentPipeline(
    new ParquetParser<SireneEstablishmentDto>(),
    sireneEstablishmentAdapter,
    sireneUniteLegaleAdapter,
    associationSearchAdapter,
    dataLogAdapter,
);
export default sireneEstablishmentPipeline;
