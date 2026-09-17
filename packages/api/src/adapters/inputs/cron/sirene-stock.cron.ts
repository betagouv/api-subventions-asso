import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import {
    sireneStockEstablishmentAdapter,
    sireneStockUniteLegaleAdapter,
} from "../../outputs/api/data-gouv/data-gouv.adapter";
import { createEstablishmentCli } from "../cli/establishment.cli";
import { createSireneStockUniteLegaleCli } from "../cli/sirene-stock-unite-legale.cli";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";

export class SireneStockCron implements CronController {
    name = "sirene";

    constructor(
        private ulPipeline: DownloadAndImport,
        private estabPipeline: DownloadAndImport,
    ) {}

    // every month on day 2 (00:00)
    @AsyncCron({ cronExpression: "0 0 2 * *" })
    async import() {
        await this.importUnitesLegale();
        await this.importEstablishments();
    }

    async importUnitesLegale() {
        return this.ulPipeline.run();
    }

    async importEstablishments() {
        return this.estabPipeline.run();
    }
}

const sireneStockCron = new SireneStockCron(
    new DownloadAndImport(
        createSireneStockUniteLegaleCli(),
        new DownloadFile(sireneStockUniteLegaleAdapter),
        new RemoveFile(),
    ),
    new DownloadAndImport(
        createEstablishmentCli(),
        new DownloadFile(sireneStockEstablishmentAdapter),
        new RemoveFile(),
    ),
);

export default sireneStockCron;
