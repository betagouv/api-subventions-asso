import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import sireneStockUniteLegaleFileService from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import { formatDateToYYYYMMDDWithSeparator } from "../../../shared/helpers/DateHelper";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import { sireneStockEstablishmentAdapter } from "../../outputs/api/data-gouv/data-gouv.adapter";
import EstablishmentCli, { createEstablishmentCli } from "../cli/establishment.cli";

export class SireneStockCron implements CronController {
    name = "sirene";

    constructor(
        private cli: EstablishmentCli,
        private downloadEstablishments: DownloadFile,
        private removeFile: RemoveFile,
    ) {}

    // every month on day 2 (00:00)
    @AsyncCron({ cronExpression: "0 0 2 * *" })
    async import() {
        await sireneStockUniteLegaleFileService.getAndParse();

        const infos = await this.downloadEstablishments.execute();

        const editionDate = (() => {
            const now = new Date();
            const lastMonthLastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
            return formatDateToYYYYMMDDWithSeparator(lastMonthLastDay, "-");
        })();

        await this.cli.parse(infos.filePath, editionDate);
        this.removeFile.execute(infos.filePath);
    }
}

const sireneStockCron = new SireneStockCron(
    createEstablishmentCli(),
    new DownloadFile(sireneStockEstablishmentAdapter),
    new RemoveFile(),
);

export default sireneStockCron;
