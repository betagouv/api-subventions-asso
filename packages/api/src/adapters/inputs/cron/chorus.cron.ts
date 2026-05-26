import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import { GetFileData } from "../../../modules/s3-file/use-cases/get-file-data";
import { GetNewS3File } from "../../../modules/s3-file/use-cases/get-new-s3-file";
import { providersS3Adapter } from "../../outputs/s3/s3.adapter";

export class ChorusCron implements CronController {
    name = "ChorusCron";

    constructor(
        private getFiles: GetNewS3File,
        private getFileData: GetFileData,
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

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const fileData = await this.getFileData.execute(mostRecentFile.path);

            // @TODO: create and call ImportChorusFile Use Case
        }
    }
}

const chorusCron = new ChorusCron(new GetNewS3File(providersS3Adapter), new GetFileData(providersS3Adapter));
export default chorusCron;
