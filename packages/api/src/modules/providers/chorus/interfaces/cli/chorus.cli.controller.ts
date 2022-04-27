import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import ChorusParser from "../../chorus.parser";
import chorusService, { RejectedRequest } from "../../chorus.service";
import { findFiles } from "../../../../../shared/helpers/ParserHelper";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import { asyncForEach } from "../../../../../shared/helpers/ArrayHelper";

@StaticImplements<CliStaticInterface>()
export default class ChorusCliController {
    static cmdName = "chorus";

    private logFileParsePath = "./logs/chorus.parse.log.txt"

    /**
     * @param file path to file
     */
    public async parse_csv(file: string) {
        if (typeof file !== "string" ) {
            throw new Error("parse_csv command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files = findFiles(file);

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${this.logFileParsePath}`);
        const logs: unknown[] = [];

        return files.reduce((acc, filePath) => {
            return acc.then(() => this._parse(filePath, logs));
        }, Promise.resolve())
            .then(() => fs.writeFileSync(this.logFileParsePath, logs.join(''), { flag: "w", encoding: "utf-8" }));
    }

    /**
     * @param file path to file
     * @param batchSize La taille des packets envoyer à mongo coup par coup
     */
    public async parse_xls(file: string, forceClean = false,  batchSize = 1000) {
        if (typeof file !== "string" ) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }
        const logs: unknown[] = [];

        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);
        const entities = ChorusParser.parseXls(fileContent, (e) => chorusService.validateEntity(e).success);
        const totalEnities = entities.length

        console.info(`\n${totalEnities} valid entities found in file.`);

        console.info("Start register in database ...");

        const batchNumber = Math.ceil(totalEnities / batchSize);
        const batchs = [];

        for(let i = 0; i < batchNumber; i++) {
            batchs.push(entities.splice(-batchSize));
        }

        const finalResult = {
            created: 0,
            rejected: 0,
        }

        await asyncForEach(batchs, async (batch, index) => {
            CliHelper.printProgress(index * 1000, totalEnities);
            const result = await chorusService.insertBatchChorusLine(batch, forceClean);
            finalResult.created += result.created;
            finalResult.rejected += result.rejected;
        });

        if (forceClean) {
            console.log("\nSwitch chorus repo ...");
            await chorusService.switchChorusRepo();
            console.log("End switch");
        }

        logs.push(`RESULT: ${JSON.stringify(finalResult)}`);
    }

    private async _parse(file: string, logs: unknown[]) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const entities = ChorusParser.parse(fileContent);

        console.info(`${entities.length} entities found in file.`);

        console.info("Start register in database ...")

        const results = await entities.reduce(async (acc, entity, i) => {
            const data = await acc;
            CliHelper.printProgress(i, entities.length);
            data.push(await chorusService.addChorusLine(entity));
            return data;
        }, Promise.resolve([]) as Promise<
        ({
            state: string, 
            result: unknown
        } 
        | RejectedRequest)[]>)

        const created = results.filter(({state}) => state === "created");
        const updated = results.filter(({state}) => state === "updated");
        const rejected = results.filter(({state}) => state === "rejected") as RejectedRequest[];

        console.info(`
            ${results.length}/${entities.length}
            ${created.length} requests created and ${updated.length} requests updated
            ${rejected.length} requests not valid
        `);

        rejected.forEach((request) => {
            logs.push(`\n\nThis request is not registered because: ${request.result.message}\n`, JSON.stringify(request.result.data, null, "\t"))
        });
    }
}