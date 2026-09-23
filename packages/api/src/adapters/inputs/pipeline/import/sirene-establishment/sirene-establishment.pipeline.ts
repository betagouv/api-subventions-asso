import { ImportReport } from "../../../../../@types/ImportReport";
import sireneEstablishmentAdapter from "../../../../outputs/db/sirene/sirene-establishment.adapter";
import { SireneEstablishmentPort } from "../../../../outputs/db/sirene/sirene-establishment.port";
import SireneEstablishmentDto from "./sirene-establishment.dto";
import SireneEstablishmentParser from "./sirene-establishment.parser";
import dataLogAdapter from "../../../../outputs/db/data-log/data-log.adapter";
import sireneUniteLegaleAdapter from "../../../../outputs/db/sirene/sirene-unite-legale.adapter";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import associationSearchAdapter from "../../../../outputs/db/association-search/association-search.adapter";
import AssociationSearchDbo from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { SireneEstablishmentMapper } from "./sirene-establishment.mapper";
import { SireneUniteLegalePort } from "../../../../outputs/db/sirene/sirene-unite-legale.port";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";

const SIRENE_ESTABLISHMENT_PROVIDER_ID = "sirene-establishment";

export class SireneEstablishmentPipeline {
    constructor(
        private parser: SireneEstablishmentParser,
        private establishmentPort: SireneEstablishmentPort,
        private uniteLegalePort: SireneUniteLegalePort,
        private searchPort: AssociationSearchPort,
        private logAdapter: DataLogPort,
    ) {}

    public async run(filePath: string): Promise<ImportReport> {
        const report: ImportReport = {
            parsedCount: 0,
            importedCount: 0,
            errorCount: 0,
        };

        const lastEditionDate = await this.logAdapter.getLastEditionDateByProvider(SIRENE_ESTABLISHMENT_PROVIDER_ID);

        let partialAssociationSearchMap: Map<
            string,
            Pick<AssociationSearchDbo, "siren"> & Partial<Pick<AssociationSearchDbo, "address">>
        > = new Map();

        await this.parser.parse(filePath, async batch => {
            report.parsedCount += batch.length;

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

            const updatedDtos = this.filterUpdatedEstablishments(batch, lastEditionDate);
            const associationDtos = await this.filterAssociationEstablishments(updatedDtos);

            const importedCount = await this.establishmentPort.upsertMany(associationDtos);

            report.importedCount += importedCount;
        });

        await this.updateAssociationSearch(partialAssociationSearchMap);

        return report;
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

    private async filterAssociationEstablishments(batch: SireneEstablishmentDto[]): Promise<SireneEstablishmentDto[]> {
        const existingSirens = new Set(await this.uniteLegalePort.filterExistingSirens(this.extractSirens(batch)));
        return batch.filter(dto => existingSirens.has(dto.siren));
    }

    private extractSirens(batch: SireneEstablishmentDto[]): string[] {
        return [...new Set(batch.map(dto => dto.siren))];
    }

    private filterUpdatedEstablishments(
        batch: SireneEstablishmentDto[],
        lastEditionDate: Date | null,
    ): SireneEstablishmentDto[] {
        if (!lastEditionDate) return batch;
        return batch.filter(dto => dto.dateDernierTraitementEtablissement > lastEditionDate);
    }
}

const sireneEstablishmentPipeline = new SireneEstablishmentPipeline(
    new SireneEstablishmentParser(),
    sireneEstablishmentAdapter,
    sireneUniteLegaleAdapter,
    associationSearchAdapter,
    dataLogAdapter,
);
export default sireneEstablishmentPipeline;
