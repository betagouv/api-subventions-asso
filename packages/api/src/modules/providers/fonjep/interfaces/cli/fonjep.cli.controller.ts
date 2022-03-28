import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../../@types";
import { findFiles } from "../../../../../shared/helpers/ParserHelper";
import FonjepParser from "../../fonjep.parser";
import fonjepService, { RejectedRequest } from "../../fonjep.service";
import FonjepRequestEntity from "../../entities/FonjepRequestEntity";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";

@StaticImplements<CliStaticInterface>()
export default class FonjepCliController {
    static cmdName = "fonjep";

    private logFileParsePath = "./logs/fonjep.parse.log.txt";

    public async parse(file: string): Promise<unknown> {
        if (typeof file !== "string" ) {
            throw new Error("Parse command need type and file args");
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

        const entities = FonjepParser.parse(fileContent);

        console.info("Start register in database ...")
        
        const results = await entities.reduce(async (acc, entity, index) => {
            const data = await acc;
            CliHelper.printProgress(index + 1 , entities.length)
            data.push(await fonjepService.createEntity(entity));
            return data;
        }, Promise.resolve([]) as Promise<
        ({
            success: true,
            state: string,
            entity: FonjepRequestEntity
        } 
        | RejectedRequest)[]>)

        const created = results.filter((result) => result.success && result.state === "created");
        const updated = results.filter((result) => result.success && result.state === "updated");
        const rejected = results.filter((result) => !result.success) as RejectedRequest[];

        console.info(`
            ${results.length}/${entities.length}
            ${created.length} requests created and ${updated.length} requests updated
            ${rejected.length} requests not valid
        `);

        rejected.forEach((result) => {
            logs.push(`\n\nThis request is not registered because: ${result.message}\n`, JSON.stringify(result.data, null, "\t"))
        });
    } 
}