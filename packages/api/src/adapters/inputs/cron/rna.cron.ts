import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import { NotificationType } from "../../../modules/notify/@types/NotificationType";
import notifyService, { NotifyService } from "../../../modules/notify/notify.service";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import { rnaWaldecAdapter } from "../../outputs/api/data-gouv/data-gouv.adapter";
import { RnaCli } from "../cli/rna.cli";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
import { NoSireneImportError } from "../pipeline/import/errors/no-sirene-import.error";
import rnaPipeline from "../pipeline/import/rna/rna.pipeline";

export class RnaCron implements CronController {
    name = "rna";

    constructor(
        private pipeline: DownloadAndImport,
        private notifier: NotifyService,
    ) {}

    // each 15 of the month at 5 am
    // make it dozen of days after Sirene to be sure to catch any failure on sirene import side
    @AsyncCron({ cronExpression: "0 15 3 * *" })
    async import() {
        console.info("starting import RNA CRON...");
        try {
            return this.pipeline.run();
        } catch (e) {
            if (e instanceof NoSireneImportError) {
                this.notifier.notify(NotificationType.CRON_BLOCKED, {
                    message: "Sirene must be updated before updating Rna",
                });
                throw e;
            } else {
                this.notifier.notify(NotificationType.FAILED_CRON, { cronName: this.name, error: e as Error });
                throw e;
            }
        }
    }
}

const rnaCron = new RnaCron(
    new DownloadAndImport(new RnaCli(rnaPipeline), new DownloadFile(rnaWaldecAdapter), new RemoveFile()),
    notifyService,
);
export default rnaCron;
