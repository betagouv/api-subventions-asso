import { ImportReport } from "../../../../../@types/ImportReport";
import sireneEstablishmentAdapter from "../../../../outputs/db/sirene/sirene-establishment.adapter";
import { SireneEstablishmentPort } from "../../../../outputs/db/sirene/sirene-establishment.port";
import SireneEstablishmentDto from "./sirene-establishment.dto";
import SireneEstablishmentParser from "./sirene-establishment.parser";
import dataLogAdapter, { DataLogAdapter } from "../../../../outputs/db/data-log/data-log.adapter";
import sireneUniteLegaleAdapter, {
    SireneUniteLegaleAdapter,
} from "../../../../outputs/db/sirene/sirene-unite-legale.adapter";

const SIRENE_ESTABLISHMENT_PROVIDER_ID = "sirene-establishment";

export class SireneEstablishmentPipeline {
    constructor(
        private parser: SireneEstablishmentParser,
        private establishmentPort: SireneEstablishmentPort,
        private uniteLegalePort: SireneUniteLegaleAdapter,
        private logAdapter: DataLogAdapter,
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

            const updatedDtos = this.filterUpdatedEstablishments(batch, lastEditionDate);
            const associationDtos = await this.filterAssociationEstablishments(updatedDtos);
            const importedCount = await this.establishmentPort.upsertMany(associationDtos);

            report.importedCount += importedCount;
        });

        return report;
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
    dataLogAdapter,
);
export default sireneEstablishmentPipeline;
