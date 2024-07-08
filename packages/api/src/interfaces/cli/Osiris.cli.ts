import fs from "fs";

import { Rna, Siret } from "dto";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import OsirisParser from "../../modules/providers/osiris/osiris.parser";
import osirisService from "../../modules/providers/osiris/osiris.service";
import OsirisActionEntity from "../../modules/providers/osiris/entities/OsirisActionEntity";
import OsirisRequestEntity from "../../modules/providers/osiris/entities/OsirisRequestEntity";
import { COLORS } from "../../shared/LogOptions";
import * as CliHelper from "../../shared/helpers/CliHelper";
import OsirisEvaluationEntity from "../../modules/providers/osiris/entities/OsirisEvaluationEntity";
import { GenericParser } from "../../shared/GenericParser";
import rnaSirenService from "../../modules/rna-siren/rnaSiren.service";

@StaticImplements<CliStaticInterface>()
export default class OsirisCli {
    static cmdName = "osiris";

    private logFileParsePath = {
        actions: "./logs/osiris.parse.actions.log.txt",
        requests: "./logs/osiris.parse.requests.log.txt",
        evaluations: "./logs/osiris.parse.evaluations.log.txt",
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

    public async parse(
        type: "requests" | "actions" | "evaluations",
        file: string,
        extractYear: string,
    ): Promise<unknown> {
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
            return this._parseRequest(fileContent, year, logs);
        } else if (type === "actions") {
            return this._parseAction(fileContent, year, logs);
        } else if (type === "evaluations") {
            return this._parseEvaluation(fileContent, year, logs);
        } else {
            throw new Error(`The type ${type} is not taken into account`);
        }
    }

    private async _parseRequest(contentFile: Buffer, year: number, logs: unknown[]) {
        const requests = OsirisParser.parseRequests(contentFile, year);

        let tictackClock = true;
        const results = await requests.reduce(async (acc, osirisRequest, index) => {
            const data = await acc;

            tictackClock = !tictackClock;
            console.log(tictackClock ? "TIC" : "TAC");

            let validation = osirisService.validRequest(osirisRequest);

            if (validation !== true && validation.code === 2) {
                // RNA NOT FOUND // TODO: use const for decribe error
                const rnaSirenEntities = await rnaSirenService.find(osirisRequest.legalInformations.siret);

                if (!rnaSirenEntities || !rnaSirenEntities.length) {
                    logs.push(
                        `\n\nThis request is not registered because: RNA not found\n`,
                        JSON.stringify(osirisRequest.legalInformations, null, "\t"),
                    );
                    return data;
                }

                osirisRequest.legalInformations.rna = rnaSirenEntities[0].rna;
                validation = osirisService.validRequest(osirisRequest); // Re-validate with the new rna
            }

            CliHelper.printProgress(index + 1, requests.length);

            if (validation !== true && validation.code != 2) {
                logs.push(
                    `\n\nThis request is not registered because: ${validation.message}\n`,
                    JSON.stringify(validation.data, null, "\t"),
                );
            } else data.push(await osirisService.addRequest(osirisRequest));

            return data;
        }, Promise.resolve([]) as Promise<{ state: string; result: OsirisRequestEntity }[]>);

        const created = results.filter(({ state }) => state === "created");
        console.info(`
            ${results.length}/${requests.length}
            ${created.length} requests created and ${results.length - created.length} requests updated
            ${requests.length - results.length} requests not valid
        `);
    }

    private async _parseAction(contentFile: Buffer, year: number, logs: unknown[]) {
        const actions = OsirisParser.parseActions(contentFile, year);
        const results = await actions.reduce(
            async (acc, osirisAction, index) => {
                const data = await acc;
                const validation = osirisService.validAction(osirisAction);

                CliHelper.printProgress(index + 1, actions.length);

                if (validation !== true) {
                    logs.push(
                        `\n\nThis request is not registered because: ${validation.message}\n`,
                        JSON.stringify(validation.data, null, "\t"),
                    );
                } else data.push(await osirisService.addAction(osirisAction));

                return data;
            },
            Promise.resolve([]) as Promise<
                {
                    state: string;
                    result: OsirisActionEntity;
                }[]
            >,
        );

        const created = results.filter(({ state }) => state === "created");
        console.info(`
            ${results.length}/${actions.length}
            ${created.length} actions created and ${results.length - created.length} actions update
            ${actions.length - results.length} actions not valid
        `);
    }

    private async _parseEvaluation(contentFile: Buffer, year: number, logs: unknown[]) {
        const evaluations = OsirisParser.parseEvaluations(contentFile, year);

        const results = await evaluations.reduce(
            async (acc, entity, index) => {
                const data = await acc;
                const validation = osirisService.validEvaluation(entity);

                CliHelper.printProgress(index + 1, evaluations.length);

                if (validation !== true) {
                    logs.push(
                        `\n\nThis request is not registered because: ${validation.message}\n`,
                        JSON.stringify(validation.data, null, "\t"),
                    );
                } else data.push(await osirisService.addEvaluation(entity));

                return data;
            },
            Promise.resolve([]) as Promise<
                {
                    state: string;
                    result: OsirisEvaluationEntity;
                }[]
            >,
        );

        const created = results.filter(({ state }) => state === "created");
        console.info(`
            ${results.length}/${evaluations.length}
            ${created.length} evaluation created and ${results.length - created.length} evaluations updated
            ${evaluations.length - results.length} evaluations not valid
        `);
    }

    async findBySiret(siret: Siret, format?: string) {
        if (typeof siret !== "string") {
            throw new Error("Parse command need siret args");
        }

        const file = await osirisService.findBySiret(siret);

        if (format === "json") {
            console.info(JSON.stringify(file));
        } else {
            console.info(file);
        }
    }

    async findByRna(rna: Rna, format?: string) {
        if (typeof rna !== "string") {
            throw new Error("Parse command need rna args");
        }

        const requests = await osirisService.findByRna(rna);

        if (format === "json") {
            console.info(JSON.stringify(requests));
        } else {
            console.info(requests);
        }
    }
}
