import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import getFileData, { GetFileData } from "../../../modules/s3-file/use-cases/get-file-data";
import getNewS3File, { GetNewS3File } from "../../../modules/s3-file/use-cases/get-new-s3-file";

export class ChorusCron implements CronController {
    name = "ChorusCron";

    constructor(
        private getFile: GetNewS3File,
        private getFileData: GetFileData,
    ) {}

    // every sunday at 2 PM
    @AsyncCron({ cronExpression: "0 14 * * 0" })
    async importNewFile() {
        const year = new Date().getFullYear();
        const files = await this.getFile.execute(`providers/chorus/${year}`);
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

const chorusCron = new ChorusCron(getNewS3File, getFileData);
export default chorusCron;
