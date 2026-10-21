import CliController from "../../../../shared/CliController";
import { formatDateToYYYYMMDDWithSeparator } from "../../../../shared/helpers/DateHelper";
import DownloadFile from "../../../../usecases/download-file";
import { RemoveFile } from "../../../../usecases/remove-file";

// use to download and import static named file
export class DownloadAndImport {
    constructor(
        private cli: CliController,
        private download: DownloadFile,
        private remove: RemoveFile,
    ) {}

    async run(fileId?: string) {
        const infos = await this.download.execute(fileId);

        const editionDate = (() => {
            const now = new Date();
            const lastMonthLastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
            return formatDateToYYYYMMDDWithSeparator(lastMonthLastDay, "-");
        })();

        // only use CLI to benefits from logs and every extra treatment from CliController
        await this.cli.parse(infos.filePath, editionDate);
        return this.remove.execute(infos.filePath);
    }
}
