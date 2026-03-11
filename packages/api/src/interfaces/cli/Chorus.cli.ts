import fs from "fs";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import ChorusParser from "../../modules/providers/chorus/chorus.parser";
import chorusService from "../../modules/providers/chorus/chorus.service";
import * as CliHelper from "../../shared/helpers/CliHelper";
import CliController from "../../shared/CliController";
import ChorusEntity from "../../modules/providers/chorus/entities/ChorusEntity";
import paymentFlatChorusService from "../../modules/paymentFlat/paymentFlat.chorus.service";
import { asyncForEach } from "../../shared/helpers/ArrayHelper";
import ChorusFseEntity from "../../modules/providers/chorus/entities/ChorusFseEntity";

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

        const { national, european } = ChorusParser.parse(fileContent);

        await Promise.all([this.persistChorusEntities(national, logger), this.persistChorusFseEntities(european)]);
    }

    private async persistChorusEntities(entities: ChorusEntity[], logger) {
        const totalEntities = entities.length;
        const exercicesSet = entities.reduce((set, entity) => set.add(entity.exercice), new Set<number>());

        console.info(`\n${totalEntities} valid entities found in file.`);

        console.info("Start register in database ...");

        const batchs: ChorusEntity[][] = [];

        for (let i = 0; i < entities.length; i += this.batchSize) {
            batchs.push(entities.slice(i, i + this.batchSize));
        }

        const finalResult = {
            created: 0,
            rejected: 0,
        };

        await asyncForEach(batchs, async (batch, index) => {
            CliHelper.printProgress(index * this.batchSize, totalEntities);
            const result = await chorusService.insertBatchChorus(batch);
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

        return;
    }

    private persistChorusFseEntities(entities: ChorusFseEntity[]) {
        return chorusService.persistEuropeanEntities(entities);
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
        const iterator = paymentFlatChorusService.cursorFindChorusOnly()[Symbol.asyncIterator]();
        const first = await iterator.next();

        if (!first.done)
            console.warn("DB already initialized, maybe you want to use 'resyncPaymentFlatByExercise' instead");
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        this.logger.logIC("Create payment flat entities from chorus");
        await paymentFlatChorusService.init();
        clearInterval(ticTacInterval);
    }
}
