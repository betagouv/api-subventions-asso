import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import sireneStockUniteLegaleFileService from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import { sireneStockEstablishmentAdapter } from "../../outputs/api/data-gouv/data-gouv.adapter";
import { createEstablishmentCli } from "../cli/establishment.cli";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";

export class SireneStockCron implements CronController {
    name = "sirene";

    constructor(private pipeline: DownloadAndImport) {}

    // every month on day 2 (00:00)
    @AsyncCron({ cronExpression: "0 0 2 * *" })
    async import() {
        await this.importUnitesLegale();
        await this.importEstablishments();
    }

    private async importUnitesLegale() {
        return sireneStockUniteLegaleFileService.getAndParse();
    }

    private async importEstablishments() {
        return this.pipeline.run();
    }
}

const sireneStockCron = new SireneStockCron(
    new DownloadAndImport(
        createEstablishmentCli(),
        new DownloadFile(sireneStockEstablishmentAdapter),
        new RemoveFile(),
    ),
);

export default sireneStockCron;
