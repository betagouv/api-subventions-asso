import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import GisproParser from "../../gispro.parser";
import gisproService from "../../gispro.service";
import GisproActionEntity from "../../entities/GisproActionEntity";
import { COLORS } from "../../../../../shared/LogOptions";
import { findFiles } from "../../../../../shared/helpers/ParserHelper";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import { asyncForEach } from "../../../../../shared/helpers/ArrayHelper";

@StaticImplements<CliStaticInterface>()
export default class GisproCliController {
    static cmdName = "gispro";

    private logFileParsePath = {
        actions: "./logs/gispro.parse.actions.log.txt"
    };

    public validate(type: string, file: string) {
        if (typeof type !== "string" || typeof file !== "string") {
            throw new Error("Validate command need type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        if (type === "actions") {
            const actions = GisproParser.parseActions(fileContent);

            console.info(`Check ${actions.length} entities!`);
            actions.forEach(entity => {
                const result = gisproService.validEntity(entity);
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
    public async parse(type: "actions", file: string, forceInsert = false): Promise<unknown> {
        if (typeof type !== "string" || typeof file !== "string") {
            throw new Error("Parse command need type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files = findFiles(file);

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${this.logFileParsePath[type]}`);

        const logs: unknown[] = [];

        return files
            .reduce((acc, filePath) => {
                return acc.then(() => this._parse(type, filePath, logs, forceInsert));
            }, Promise.resolve())
            .then(() =>
                fs.writeFileSync(this.logFileParsePath[type], logs.join(""), {
                    flag: "w",
                    encoding: "utf-8"
                })
            );
    }

    private async _parse(type: string, file: string, logs: unknown[], forceInsert: boolean) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        if (type === "actions") {
            return this._parseActions(fileContent, logs, forceInsert);
        } else {
            throw new Error(`The type ${type} is not taken into account`);
        }
    }

    private async _parseActions(contentFile: Buffer, logs: unknown[], forceInsert: boolean) {
        const actions = GisproParser.parseActions(contentFile);
        const stack: GisproActionEntity[] = [];
        let created = 0;
        let updated = 0;

        const insert = async (entities: GisproActionEntity[]) => {
            const result: { insertedCount: number; modifiedCount?: number } = forceInsert
                ? await gisproService.insertMany(entities)
                : await gisproService.upsertMany(entities);

            created += result.insertedCount;
            updated += result.modifiedCount || 0;
        };

        await asyncForEach(actions, async (action, index) => {
            const validation = gisproService.validEntity(action);

            CliHelper.printProgress(index + 1, actions.length);

            if (!validation.success) {
                logs.push(
                    `\n\nThis request is not registered because: ${validation.message}\n`,
                    JSON.stringify(validation.data, null, "\t")
                );
            } else stack.push(action);

            if (stack.length >= 1000) {
                const chunk = stack.splice(-1000);
                await insert(chunk);
            }
        });

        if (stack.length != 0) await insert(stack);

        console.info(`
            ${created + updated}/${actions.length}
            ${created} actions created and ${updated} actions updated
            ${actions.length - (created + updated)} actions not valid
        `);
    }
}
