import fs from "fs";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import OsirisParser from "../../modules/providers/osiris/osiris.parser";
import osirisService, { InvalidOsirisRequestError } from "../../modules/providers/osiris/osiris.service";
import OsirisActionEntity from "../../modules/providers/osiris/entities/OsirisActionEntity";
import OsirisRequestEntity from "../../modules/providers/osiris/entities/OsirisRequestEntity";
import { COLORS } from "../../shared/LogOptions";
import * as CliHelper from "../../shared/helpers/CliHelper";
import { GenericParser } from "../../shared/GenericParser";
import dataLogService from "../../modules/data-log/dataLog.service";

@StaticImplements<CliStaticInterface>()
export default class OsirisCli {
    static cmdName = "osiris";

    private logFileParsePath = {
        actions: "./logs/osiris.parse.actions.log.txt",
        requests: "./logs/osiris.parse.requests.log.txt",
    };

    public validate(type: string, file: string, extractYear = "2022") {
        if (typeof type != "string" && typeof file != "string" && typeof extractYear != "string") {
            throw new Error("Validate command need type, extractYear and file args");
        }

        if (Number.isNaN(parseInt(extractYear, 10))) {
            throw new Error("extractYear must be a number");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        if (type === "requests") {
            const requests = OsirisParser.parseRequests(fileContent, parseInt(extractYear, 10));

            console.info(`Check ${requests.length} entities!`);
            requests.forEach(entity => {
                const result = osirisService.validRequest(entity);
                if (result !== true) {
                    console.error(`${COLORS.FgRed}${result.message}${COLORS.Reset}`, result.data);
                }
            });

            console.info(`${COLORS.Reset}Validation done`);
        } else if (type === "actions") {
            const actions = OsirisParser.parseActions(fileContent, parseInt(extractYear, 10));
            console.info(`Check ${actions.length} entities!`);
            actions.forEach(entity => {
                const result = osirisService.validAction(entity);
                if (result !== true) {
                    console.error(`${COLORS.FgRed}${result.message}${COLORS.Reset}`, result.data);
                }
            });

            console.info(`${COLORS.Reset}Validation done`);
        } else {
            throw new Error(`The type ${type} is not found`);
        }
    }

    public async parse(type: "requests" | "actions", file: string, extractYear: string): Promise<unknown> {
        if (typeof type != "string" && typeof file != "string" && typeof extractYear != "string") {
            throw new Error("Parse command need type, extractYear and file args");
        }

        if (Number.isNaN(parseInt(extractYear, 10))) {
            throw new Error("extractYear must be a number");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files = GenericParser.findFiles(file);
        const logs: unknown[] = [];

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${this.logFileParsePath}`);

        return files
            .reduce((acc, filePath) => {
                return acc.then(() => this._parse(type, filePath, parseInt(extractYear, 10), logs));
            }, Promise.resolve())
            .then(() =>
                fs.writeFileSync(this.logFileParsePath[type], logs.join(""), {
                    flag: "w",
                    encoding: "utf-8",
                }),
            );
    }

    protected async _parse(type: string, file: string, year: number, logs: unknown[]) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        if (type === "requests") {
            await this._parseRequest(fileContent, year, logs);
        } else if (type === "actions") {
            await this._parseAction(fileContent, year, logs);
        } else {
            throw new Error(`The type ${type} is not taken into account`);
        }

        // this assumes that extraction date is close enough to integration date. Is it?
        await dataLogService.addLog(osirisService.provider.id, file, new Date());
    }

    async _parseRequest(contentFile: Buffer, year: number, logs: unknown[]) {
        const requests = OsirisParser.parseRequests(contentFile, year);
        let nbErrors = 0;

        let tictackClock = true;
        const ticTacInterval = setInterval(() => {
            tictackClock = !tictackClock;
            console.log(tictackClock ? "TIC" : "TAC");
        }, 100000);
        const validated: OsirisRequestEntity[] = [];

        // validate all requests in any order
        await Promise.all(
            requests.map(r =>
                osirisService
                    .validateAndComplete(r)
                    .then(() => validated.push(r))
                    .catch((e: InvalidOsirisRequestError) => {
                        logs.push(
                            `\n\nThis request is not registered because: ${e.validation.message}\n`,
                            JSON.stringify(e.validation.data, null, "\t"),
                        );
                        nbErrors += 1;
                    }),
            ),
        );
        const result = await osirisService.bulkAddRequest(validated);
        clearInterval(ticTacInterval);
        if (!result) return;

        CliHelper.printProgress(validated.length, requests.length);
        console.info(`
            ${validated.length}/${requests.length}
            ${result.insertedCount + result.upsertedCount} requests created and ${
                result.modifiedCount + result.matchedCount
            } requests updated
            ${nbErrors} requests not valid
        `);
    }

    async _parseAction(contentFile: Buffer, year: number, logs: unknown[]) {
        const actions = OsirisParser.parseActions(contentFile, year);
        let nbErrors = 0;

        let tictackClock = true;
        const ticTacInterval = setInterval(() => {
            tictackClock = !tictackClock;
            console.log(tictackClock ? "TIC" : "TAC");
        }, 100000);
        const validated: OsirisActionEntity[] = [];

        actions.map(a => {
            const validation = osirisService.validAction(a);
            if (validation !== true) {
                logs.push(
                    `\n\nThis request is not registered because: ${validation.message}\n`,
                    JSON.stringify(validation.data, null, "\t"),
                );
                nbErrors += 1;
            } else validated.push(a);
        });

        const result = await osirisService.bulkAddActions(validated);
        clearInterval(ticTacInterval);
        if (!result) return;

        CliHelper.printProgress(validated.length, actions.length);
        console.info(`
            ${validated.length}/${actions.length}
            ${result.insertedCount + result.upsertedCount} actions created and ${
                result.modifiedCount + result.matchedCount
            } actions updated
            ${nbErrors} actions not valid
        `);
    }
}
