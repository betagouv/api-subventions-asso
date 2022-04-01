import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../../@types";
import GisproParser from "../../gispro.parser";
import gisproService from "../../gispro.service";
import OsirisRequestEntity from "../../entities/GisproRequestEntity";
import { COLORS } from "../../../../../shared/LogOptions";
import { findFiles } from "../../../../../shared/helpers/ParserHelper";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import rnaSirenService from "../../../../rna-siren/rnaSiren.service";

@StaticImplements<CliStaticInterface>()
export default class GisproCliController {
    static cmdName = "gispro";

    private logFileParsePath = {
        requests: "./logs/gispro.parse.requests.log.txt"
    };

    public validate(type: string, file: string) {
        if (typeof type !== "string" || typeof file !== "string" ) {
            throw new Error("Validate command need type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        if (type === "requests") {
            const requests = GisproParser.parseRequests(fileContent);

            console.info(`Check ${requests.length} entities!`);
            requests.forEach((entity) => {
                const result = gisproService.validRequest(entity);
                if (!result.success) {
                    console.error(`${COLORS.FgRed}${result.message}${COLORS.Reset}`, result.data);
                }
            });

            console.info(`${COLORS.Reset}Validation done`);
        } else {
            throw new Error(`The type ${type} is not found`);
        }
    }

    // REFACTOR: this could be extract and shared through different CLI
    public async parse(type: "requests", file: string): Promise<unknown> {
        if (typeof type !== "string" || typeof file !== "string" ) {
            throw new Error("Parse command need type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files = findFiles(file);

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${this.logFileParsePath[type]}`);

        const logs: unknown[] = [];
        
        return files.reduce((acc, filePath) => {
            return acc.then(() => this._parse(type, filePath, logs));
        }, Promise.resolve())
            .then(() => fs.writeFileSync(this.logFileParsePath[type], logs.join(''), { flag: "w", encoding: "utf-8" }));
    }

    private async _parse(type: string, file: string, logs: unknown[]) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        if (type === "requests") {
            return this._parseRequest(fileContent, logs);
        } else {
            throw new Error(`The type ${type} is not taken into account`);
        }
    }

    private async _parseRequest(contentFile: Buffer, logs: unknown[]) {
        const requests = GisproParser.parseRequests(contentFile);
        const results = await requests.reduce(async (acc, gisproRequest, index) => {
            const data = await acc;
            const validation = gisproService.validRequest(gisproRequest);

            CliHelper.printProgress(index + 1 , requests.length);

            // TODO: Stack 1000 request before insert to mongo
            if (!validation.success) {
                logs.push(`\n\nThis request is not registered because: ${validation.message}\n`, JSON.stringify(validation.data, null, "\t"));
            } else data.push( await gisproService.addRequest(gisproRequest));

            return data;
        }, Promise.resolve([]) as Promise<{ state: string, result: OsirisRequestEntity}[]>);

        const created = results.filter(({state}) => state === "created");
        console.info(`
            ${results.length}/${requests.length}
            ${created.length} requests created and ${results.length - created.length} requests updated
            ${requests.length - results.length} requests not valid
        `);
    }
}