import { ImportReport } from "../../../../../@types/ImportReport";
import sireneEstablishmentAdapter from "../../../../outputs/db/sirene/sirene-establishment.adapter";
import { SireneEstablishmentPort } from "../../../../outputs/db/sirene/sirene-establishment.port";
import SireneEstablishmentDto from "./sirene-establishment.dto";
import dataLogAdapter from "../../../../outputs/db/data-log/data-log.adapter";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import associationSearchAdapter from "../../../../outputs/db/association-search/association-search.adapter";
import { EstablishmentAssociationSearch } from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { SireneEstablishmentMapper } from "./sirene-establishment.mapper";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";
import { ImportPipeline } from "../import-pipeline";
import { addMonths } from "../../../../../shared/helpers/DateHelper";
import { ParquetParser } from "../../../parquet.parser";
import { Readable, Transform, Writable } from "stream";
import { pipeline } from "stream/promises";
import { SireneUniteLegalePort } from "../../../../outputs/db/sirene/sirene-unite-legale.port";
import sireneUniteLegaleAdapter from "../../../../outputs/db/sirene/sirene-unite-legale.adapter";
import { GeoApiPort } from "../../../../outputs/db/providers/geo-api/geo.port";
import geoAdapter from "../../../../outputs/db/providers/geo-api/geo.adapter";

const SIRENE_ESTABLISHMENT_PROVIDER_ID = "sirene-establishment";

export class SireneEstablishmentPipeline extends ImportPipeline {
    constructor(
        private parser: ParquetParser<SireneEstablishmentDto>,
        private establishmentPort: SireneEstablishmentPort,
        private uniteLegalePort: SireneUniteLegalePort,
        private searchPort: AssociationSearchPort,
        private logAdapter: DataLogPort,
        private geoPort: GeoApiPort,
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

        const addressesByAffectedSiren = new Map<string, EstablishmentAssociationSearch["address"]>();

        stages.push(
            new Writable({
                objectMode: true,
                write: async (batch: SireneEstablishmentDto[], _enc, callback) => {
                    try {
                        this.report.parsedCount += batch.length;

                        const associationDtos = await this.filterAssociationEstablishments(batch);
                        if (associationDtos.length === 0) return callback();

                        this.extractAssociationSearchData(associationDtos, addressesByAffectedSiren);
                        this.report.importedCount += await this.establishmentPort.upsertMany(associationDtos);

                        callback();
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
        );

        await pipeline(stages);

        await this.updateAssociationSearch(addressesByAffectedSiren);

        return this.report;
    }

    private async updateAssociationSearch(
        addressesByAffectedSiren: ReadonlyMap<string, EstablishmentAssociationSearch["address"]>,
    ) {
        if (addressesByAffectedSiren.size === 0) return;

        const validDepartmentCodes = (await this.geoPort.getAllDepartmentCodes()).map(code => code.toUpperCase());
        const sirens = Array.from(addressesByAffectedSiren.keys());
        const CHUNK_SIZE = 10000;

        console.log(`starting upserting ${sirens.length} association-search...`);

        for (let i = 0; i < sirens.length; i += CHUNK_SIZE) {
            console.time("chunk");

            const chunk = sirens.slice(i, i + CHUNK_SIZE);
            const iterable = this.establishmentPort.getComputedFields(chunk);

            const associationSearch: EstablishmentAssociationSearch[] = [];

            for await (const { communeCodes, ...computedFields } of iterable) {
                const association: EstablishmentAssociationSearch = {
                    ...computedFields,
                    departmentCodes: this.getDepartmentCodes(communeCodes, validDepartmentCodes),
                };
                const address = addressesByAffectedSiren.get(association.siren);
                if (address) association.address = address;
                associationSearch.push(association);
            }

            await this.searchPort.upsertFromEstablishment(associationSearch);
            console.timeEnd("chunk");
        }
    }

    // use commune codes to find department and keep postal codes for exact searches
    private getDepartmentCodes(communeCodes: string[], validDepartmentCodes: string[]): string[] {
        const departmentCodes = communeCodes.map(communeCode => {
            const normalizedCommuneCode = communeCode.trim().toUpperCase();
            return validDepartmentCodes.find(code => normalizedCommuneCode.startsWith(code));
        });
        return [...new Set(departmentCodes.filter((code): code is string => Boolean(code)))];
    }

    private extractAssociationSearchData(
        dtos: SireneEstablishmentDto[],
        addressesByAffectedSiren: Map<string, EstablishmentAssociationSearch["address"]>,
    ) {
        for (const dto of dtos) {
            if (dto.etablissementSiege) {
                const { address } = SireneEstablishmentMapper.toAssociationSearch(dto);
                addressesByAffectedSiren.set(dto.siren, address);
            } else if (!addressesByAffectedSiren.has(dto.siren)) {
                addressesByAffectedSiren.set(dto.siren, undefined);
            }
        }
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
    geoAdapter,
);
export default sireneEstablishmentPipeline;
