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

        await this.parser.parse(filePath, async batch => {
            report.parsedCount += batch.length;

            // first, updates AssociationSearch
            await this.updateAssociationSearch(batch);

            // then, updates establishment -> prevent associationSearch from not being updated after establishment
            const updatedDtos = this.filterUpdatedEstablishments(batch, lastEditionDate);
            const associationDtos = await this.filterAssociationEstablishments(updatedDtos);

            const importedCount = await this.establishmentPort.upsertMany(associationDtos);
            await this.updateAssociationSearchPostalCodes(associationDtos);

            report.importedCount += importedCount;
        });

        return report;
    }

    private async updateAssociationSearch(dtos: SireneEstablishmentDto[]) {
        // group by siren
        const mapBySiren = dtos.reduce((groups, dto) => {
            const siren = dto.siren;
            if (groups.has(siren)) groups.set(siren, [...groups.get(siren)!, dto]);
            else groups.set(siren, [dto]);
            return groups;
        }, new Map<string, SireneEstablishmentDto[]>());

        // for each group filter main and update address
        const updates: Pick<AssociationSearchDbo, "siren" | "address">[] = [];
        for (const [_key, group] of mapBySiren) {
            const mainEstablishment = group.find(dto => dto.etablissementSiege);
            if (mainEstablishment) updates.push(SireneEstablishmentMapper.toAssociationSearch(mainEstablishment));
        }

        this.searchPort.upsertMany(updates);
    }

    private async updateAssociationSearchPostalCodes(batch: SireneEstablishmentDto[]) {
        if (!batch.length) return;

        const postalCodesBySiren = await this.establishmentPort.getPostalCodesBySirens(this.extractSirens(batch));
        await this.searchPort.updatePostalCodesBySirens(postalCodesBySiren);
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
