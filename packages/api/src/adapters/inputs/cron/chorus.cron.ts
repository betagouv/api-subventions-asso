import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import { GetFileData } from "../../../modules/s3-file/use-cases/get-file-data";
import { GetNewS3File } from "../../../modules/s3-file/use-cases/get-new-s3-file";
import { S3Error } from "../../outputs/s3/@errors/S3Error";
import { providersS3Adapter } from "../../outputs/s3/s3.adapter";
import chorusImport, { ChorusImport } from "../pipeline/import/chorus/chorus.import";

export class ChorusCron implements CronController {
    name = "ChorusCron";

    constructor(
        private getFiles: GetNewS3File,
        private getFileData: GetFileData,
        private chorusImport: ChorusImport,
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

            const fileData = await this.getFileData.execute(mostRecentFile.path);
            if (fileData?.buffer) {
                return this.chorusImport.run(fileData?.buffer);
            } else {
                throw new S3Error("Undefined Buffer");
            }
        }
    }
}

const chorusCron = new ChorusCron(
    new GetNewS3File(providersS3Adapter),
    new GetFileData(providersS3Adapter),
    chorusImport,
);
export default chorusCron;
