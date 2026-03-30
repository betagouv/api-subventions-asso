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

        let withEuropeanData = true; // since 2026 we got european data
        if (args.includes("--no-fse")) withEuropeanData = false;

        const { national, european } = ChorusParser.parse(fileContent, {
            withoutEuropeanData: !withEuropeanData,
        });

        const promises = [this.persistChorusEntities(national, logger)];

        if (withEuropeanData) promises.push(this.persistChorusFseEntities(european!));

        await Promise.all(promises);
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
            await this.resyncFlatByExercise(exercise);
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

    /**
     * Exercice should be of type number but when invoking from CLI it will always be a string
     * @param exercise
     */
    async resyncFlatByExercise(exercise: string | number) {
        const exerciseNumber = Number(exercise);
        if (isNaN(exerciseNumber)) throw new Error("Exercise must be a valid number");

        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        this.logger.logIC(`Resync payment flat collection for exercice ${exerciseNumber}`);
        await paymentFlatChorusService.updatePaymentsFlatCollection(exerciseNumber);
        await chorusService.syncFlatByExercise(exerciseNumber);
        clearInterval(ticTacInterval);
    }

    async resetFlat() {
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        this.logger.logIC("Create payment flat entities from chorus");
        await paymentFlatChorusService.init();
        await chorusService.initFlat();
        clearInterval(ticTacInterval);
    }
}
