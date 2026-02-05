import fs from "fs";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import ChorusParser from "../../modules/providers/chorus/chorus.parser";
import chorusService from "../../modules/providers/chorus/chorus.service";
import * as CliHelper from "../../shared/helpers/CliHelper";
import CliController from "../../shared/CliController";
import ChorusLineEntity from "../../modules/providers/chorus/entities/ChorusLineEntity";
import paymentFlatChorusService from "../../modules/paymentFlat/paymentFlat.chorus.service";
import { asyncForEach } from "../../shared/helpers/ArrayHelper";
import { runTransaction } from "../../shared/transaction";

@StaticImplements<CliStaticInterface>()
export default class ChorusCli extends CliController {
    static cmdName = "chorus";

    protected logFileParsePath = "./logs/chorus.parse.log.txt";
    protected _serviceMeta = chorusService.meta;
    protected batchSize = 1000;

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

        const entities: ChorusLineEntity[] = ChorusParser.parse(fileContent);
        const totalEntities = entities.length;
        const exercicesSet = entities.reduce(
            (set, entity) => set.add(entity.indexedInformations.exercice),
            new Set<number>(),
        );

        console.info(`\n${totalEntities} valid entities found in file.`);

        console.info("Start register in database ...");

        const batchs: ChorusLineEntity[][] = [];

        for (let i = 0; i < entities.length; i += this.batchSize) {
            batchs.push(entities.slice(i, i + this.batchSize));
        }

        const finalResult = {
            created: 0,
            rejected: 0,
        };

        await runTransaction(async () => {
            await asyncForEach(batchs, async (batch, index) => {
                CliHelper.printProgress(index * this.batchSize, totalEntities);
                const result = await chorusService.insertBatchChorusLine(batch);
                finalResult.created += result.created;
                finalResult.rejected += result.rejected;
            });

            logger.push(`RESULT: ${JSON.stringify(finalResult)}`);

            for (const exercise of exercicesSet) {
                await this.resyncPaymentFlatByExercise(exercise);
            }

            fs.writeFileSync(this.logFileParsePath, logger.join(""), {
                flag: "w",
                encoding: "utf-8",
            });
        });
    }

    async resyncPaymentFlatByExercise(exercise: string | number) {
        // string when directly called by the CLI and number when called in _parse
        if (typeof exercise === "string") {
            exercise = Number(exercise);
        }
        if (isNaN(exercise)) throw new Error("Exercise must be a valid number");
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        this.logger.logIC(`Resync payment flat collection for exercice ${exercise}`);
        await paymentFlatChorusService.updatePaymentsFlatCollection(exercise);
        clearInterval(ticTacInterval);
    }

    async resetPaymentFlat() {
        if ((await paymentFlatChorusService.cursorFindChorusOnly().toArray()).length)
            console.warn("DB already initialized, maybe you want to use 'resyncPaymentFlatByExercise' instead");
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        this.logger.logIC("Create payment flat entities from chorus");
        await paymentFlatChorusService.init();
        clearInterval(ticTacInterval);
    }
}
