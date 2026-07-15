import { ImportReport } from "../../../../../@types/ImportReport";
import sireneEstablishmentAdapter from "../../../../outputs/db/sirene/sirene-establishment.adapter";
import { SireneEstablishmentPort } from "../../../../outputs/db/sirene/sirene-establishment.port";
import sireneUniteLegaleService, {
    SireneUniteLegaleService,
} from "../../../../../modules/providers/sirene/sirene-unite-legale.service";
import SireneEstablishmentDto from "./sirene-establishment.dto";
import SireneEstablishmentParser from "./sirene-establishment.parser";

export class SireneEstablishmentImport {
    constructor(
        private parser: SireneEstablishmentParser,
        private establishmentPort: SireneEstablishmentPort,
        private sireneUniteLegale: SireneUniteLegaleService,
    ) {}

    public async run(filePath: string): Promise<ImportReport> {
        if (!(await this.sireneUniteLegale.collectionIsNotEmpty())) {
            throw new Error("Sirene unite legale collection must be imported before establishments");
        }

        const report: ImportReport = {
            parsedCount: 0,
            importedCount: 0,
            errorCount: 0,
        };

        await this.parser.parse(filePath, async batch => {
            report.parsedCount += batch.length;

            const associationDtos = await this.filterAssociationEstablishments(batch);
            const importedCount = await this.establishmentPort.saveNewer(associationDtos);

            report.importedCount += importedCount;
        });

        return report;
    }

    private async filterAssociationEstablishments(batch: SireneEstablishmentDto[]): Promise<SireneEstablishmentDto[]> {
        const existingSirens = new Set(await this.sireneUniteLegale.filterExistingSirens(this.extractSirens(batch)));
        return batch.filter(dto => existingSirens.has(dto.siren));
    }

    private extractSirens(batch: SireneEstablishmentDto[]): string[] {
        return [...new Set(batch.map(dto => dto.siren))];
    }
}

const sireneEstablishmentImport = new SireneEstablishmentImport(
    new SireneEstablishmentParser(),
    sireneEstablishmentAdapter,
    sireneUniteLegaleService,
);
export default sireneEstablishmentImport;
