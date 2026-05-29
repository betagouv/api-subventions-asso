import fs from "fs";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import { CliStaticInterface } from "../../../@types";
import chorusService from "../../../modules/providers/chorus/chorus.service";
import CliController from "../../../shared/CliController";
import paymentFlatChorusService from "../../../modules/payment-flat/payment-flat.chorus.service";
import { ChorusImport } from "../pipeline/import/chorus/chorus.import";
import { UpdateFlatByExercise } from "../../../modules/providers/chorus/use-cases/update-flat-by-exercise";

@StaticImplements<CliStaticInterface>()
export default class ChorusCli extends CliController {
    static cmdName = "chorus";

    protected logFileParsePath = "./logs/chorus.parse.log.txt";
    protected _serviceMeta = chorusService.meta;
    protected batchSize = 1000;

    constructor(
        private chorusImport: ChorusImport,
        private updateFlatByExercise: UpdateFlatByExercise,
    ) {
        super();
    }

    /**
     * Parse Chorus XLS files
     * @param file path to file
     * @param logger
     */
    protected async _parse(file: string, logger) {
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
        await this.chorusImport.run(fileContent);
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
}
