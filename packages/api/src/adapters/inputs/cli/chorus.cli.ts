import fs from "fs";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import { CliStaticInterface } from "../../../@types";
import chorusService from "../../../modules/providers/chorus/chorus.service";
import CliController from "../../../shared/CliController";
import paymentFlatChorusService from "../../../modules/payment-flat/payment-flat.chorus.service";
import { ChorusPipeline } from "../pipeline/import/chorus/chorus.pipeline";
import { UpdateFlatByExercise } from "../../../modules/providers/chorus/use-cases/update-flat-by-exercise";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import { ChorusUpload } from "../pipeline/upload/chorus/chorus.upload";
import type { S3Port } from "../../outputs/s3/s3.port";

@StaticImplements<CliStaticInterface>()
export default class ChorusCli extends CliController {
    static cmdName = "chorus";

    protected logFileParsePath = "./logs/chorus.parse.log.txt";
    protected _serviceMeta = chorusService.meta;
    protected batchSize = 1000;

    constructor(
        private uploader: ChorusUpload,
        private downloader: DownloadFile,
        private s3: S3Port,
        private chorusPipeline: ChorusPipeline,
        private updateFlatByExercise: UpdateFlatByExercise,
    ) {
        super();
    }

    /**
     * Parse Chorus XLS files
     * @param file path to file
     * @param logger
     */
    protected async _parse(file: string, logger, ...args) {
        if (typeof file !== "string") {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        console.info("\nStart parse file: ", file);
        logger.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        console.log("start importing chorus data into the system...");
        return this.chorusPipeline.run(fileContent, {
            withoutEuropeanData: args.includes("--no-fse"),
        });
    }

    async syncFlatByExercise(exercise: string) {
        await this.updateFlatByExercise.execute(Number(exercise));
    }

    async resetFlat() {
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        this.logger.logIC("Create payment flat entities from chorus");
        await paymentFlatChorusService.init();
        await chorusService.initFlat();
        clearInterval(ticTacInterval);
    }

    // download and import latest chorus file from the s3 bucket
    async import() {
        const list = await this.s3.listFiles("chorus");
        const latest = list.sort((a, b) => new Date(b.importDate).getTime() - new Date(a.importDate).getTime())[0];
        await new DownloadAndImport(this, this.downloader, new RemoveFile()).run(latest.path);
    }

    // download and upload to s3 bucket the latest file from chorus omogen
    async upload() {
        await this.uploader.run();
    }
}
