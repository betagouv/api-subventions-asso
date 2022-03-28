import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import ChorusParser from "../../chorus.parser";
import chorusService, { RejectedRequest } from "../../chorus.service";
import { findFiles } from "../../../../../shared/helpers/ParserHelper";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";

@StaticImplements<CliStaticInterface>()
export default class ChorusCliController {
    static cmdName = "chorus";

    private logFileParsePath = "./logs/chorus.parse.log.txt"

    /**
     * @param file path to file
     */
    public async parse(file: string) {
        if (typeof file !== "string" ) {
            throw new Error("Parse command need file args");
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