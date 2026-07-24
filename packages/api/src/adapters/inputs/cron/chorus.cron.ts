import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import { GetNewS3File } from "../../../modules/s3-file/use-cases/get-new-s3-file";
import tagImportedFile, { TagImportedFile } from "../../../modules/s3-file/use-cases/tag-imported-file";
import DownloadFile from "../../../usecases/download-file";
import { providersS3Adapter } from "../../outputs/s3/s3.adapter";
import chorusImport, { ChorusImport } from "../pipeline/import/chorus/chorus.import";
import fs from "fs";

export class ChorusCron implements CronController {
    name = "ChorusCron";

    constructor(
        private getFiles: GetNewS3File,
        private downloadFile: DownloadFile,
        private chorusImport: ChorusImport,
        private tagFile: TagImportedFile,
    ) {}

    // every sunday at 2 PM
    @AsyncCron({ cronExpression: "0 14 * * 0" })
    async importNewFile() {
        const year = new Date().getFullYear();
        const files = await this.getFiles.execute(`providers/chorus/${year}`);
        if (!files || files.length === 0) {
            console.log("CHORUS CRON: no file to import");
            return;
        } else {
            const mostRecentFile = files.reduce((latest, file) =>
                file.importDate > latest.importDate ? file : latest,
            );

            const infos = await this.downloadFile.execute(mostRecentFile.path);
            await this.chorusImport.run(await fs.promises.readFile(infos.filePath));
            return this.tagFile.execute(mostRecentFile.path);
        }
    }
}

const chorusCron = new ChorusCron(
    new GetNewS3File(providersS3Adapter),
    new DownloadFile(providersS3Adapter),
    chorusImport,
    tagImportedFile,
);
export default chorusCron;
