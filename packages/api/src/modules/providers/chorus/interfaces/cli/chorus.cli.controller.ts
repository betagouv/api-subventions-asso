import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import ChorusParser from "../../chorus.parser";
import chorusService from "../../chorus.service";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import { asyncForEach } from "../../../../../shared/helpers/ArrayHelper";
import CliController from "../../../../../shared/CliController";
import ChorusLineEntity from "../../entities/ChorusLineEntity";

@StaticImplements<CliStaticInterface>()
export default class ChorusCliController extends CliController {
    static cmdName = "chorus";

    protected logFileParsePath = "./logs/chorus.parse.log.txt";
    protected batchSize = 1000;

    /**
     * Parse Chorus XLS files
     * @param file path to file
     * @param batchSize La taille des paquets envoyés à mongo coup par coup
     */
    protected async _parse(file: string, logger, _exportDate) {
        if (typeof file !== "string") {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        console.info("\nStart parse file: ", file);
        logger.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const chorusEntityValidator = entity => {
            try {
                return chorusService.validateEntity(entity);
            } catch (e) {
                logger.push(
                    `\n\nThis request is not registered because: ${(e as Error).message}\n`,
                    JSON.stringify(entity, null, "\t"),
                );
                return false;
            }
        };

        const entities = ChorusParser.parse(fileContent, chorusEntityValidator);

        const totalEntities = entities.length;

        console.info(`\n${totalEntities} valid entities found in file.`);

        console.info("Start register in database ...");

        const batchNumber = Math.ceil(totalEntities / this.batchSize);
        const batchs: ChorusLineEntity[][] = [];

        for (let i = 0; i < batchNumber; i++) {
            batchs.push(entities.splice(-this.batchSize));
        }

        const finalResult = {
            created: 0,
            rejected: 0,
        };

        await asyncForEach(batchs, async (batch, index) => {
            CliHelper.printProgress(index * 1000, totalEntities);
            const result = await chorusService.insertBatchChorusLine(batch);
            finalResult.created += result.created;
            finalResult.rejected += result.rejected;
        });

        logger.push(`RESULT: ${JSON.stringify(finalResult)}`);

        fs.writeFileSync(this.logFileParsePath, logger.join(""), {
            flag: "w",
            encoding: "utf-8",
        });
    }
}
