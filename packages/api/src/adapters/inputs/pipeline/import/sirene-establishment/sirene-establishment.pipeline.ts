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
import { ImportPipeline } from "../ImportPipeline";
import { addMonths } from "../../../../../shared/helpers/DateHelper";
import { ParquetParser } from "../../../parquet.parser";
import { Readable, Transform, Writable } from "stream";
import { pipeline } from "stream/promises";
import { SireneUniteLegalePort } from "../../../../outputs/db/sirene/sirene-unite-legale.port";
import sireneUniteLegaleAdapter from "../../../../outputs/db/sirene/sirene-unite-legale.adapter";

const SIRENE_ESTABLISHMENT_PROVIDER_ID = "sirene-establishment";

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

        let partialAssociationSearchMap: Map<
            string,
            Pick<AssociationSearchDbo, "siren"> & Partial<Pick<AssociationSearchDbo, "address">>
        > = new Map();

        stages.push(
            new Writable({
                objectMode: true,
                write: async (batch: SireneEstablishmentDto[], _enc, callback) => {
                    try {
                        this.report.parsedCount += batch.length;

                        // build partials association-search to be updated
                        partialAssociationSearchMap = new Map([
                            // build object from each siren
                            ...new Map(this.extractSirens(batch).map(siren => [siren, { siren }])),
                            // merge with previous objects
                            // order matters or previous assocationSearch with address could be erased
                            ...partialAssociationSearchMap,
                            // merge addresses to update
                            ...this.getAddressesToUpdate(batch),
                        ]);

                        const associationDtos = await this.filterAssociationEstablishments(batch);

                        this.report.importedCount += await this.establishmentPort.upsertMany(associationDtos);

                        callback();
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
        );

        await pipeline(stages);

        await this.updateAssociationSearch(partialAssociationSearchMap);

        return this.report;
    }

    private async updateAssociationSearch(
        map: Map<string, Pick<AssociationSearchDbo, "siren"> & Partial<Pick<AssociationSearchDbo, "address">>>,
    ) {
        const iterable = this.establishmentPort.getComputedFields([...map.keys()]);

        let batch: Partial<Pick<AssociationSearchDbo, "siren" | "address" | "nbEstabs" | "postalCodes">>[] = [];

        for await (const item of iterable) {
            const match = map.get(item.siren);
            if (match) Object.assign(item, match);
            batch.push(item);
            if (batch.length === 1000) {
                await this.searchPort.upsertMany(batch);
                batch = [];
            }
        }

        if (batch.length) {
            await this.searchPort.upsertMany(batch);
        }
    }

    private getAddressesToUpdate(dtos: SireneEstablishmentDto[]) {
        // group by siren
        const mapBySiren = dtos.reduce((groups, dto) => {
            const siren = dto.siren;
            if (groups.has(siren)) groups.set(siren, [...groups.get(siren)!, dto]);
            else groups.set(siren, [dto]);
            return groups;
        }, new Map<string, SireneEstablishmentDto[]>());

        // for each group filter main and update address
        const updates: Map<string, Pick<AssociationSearchDbo, "siren" | "address">> = new Map();
        for (const [_key, group] of mapBySiren) {
            const mainEstablishment = group.find(dto => dto.etablissementSiege);
            if (mainEstablishment)
                updates.set(mainEstablishment.siren, SireneEstablishmentMapper.toAssociationSearch(mainEstablishment));
        }

        return updates;
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
