import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { Rna, Siret } from "@api-subventions-asso/dto";
import { CliStaticInterface} from "../../../../../@types";
import OsirisParser from "../../osiris.parser";
import osirisService from "../../osiris.service";
import OsirisActionEntity from "../../entities/OsirisActionEntity";
import OsirisRequestEntity from "../../entities/OsirisRequestEntity";
import { COLORS } from "../../../../../shared/LogOptions";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import rnaSirenService from "../../../../open-data/rna-siren/rnaSiren.service";
import OsirisEvaluationEntity from '../../entities/OsirisEvaluationEntity';
import { findFiles } from '../../../../../shared/helpers/ParserHelper';


@StaticImplements<CliStaticInterface>()
export default class OsirisCliController {
    static cmdName = "osiris";

    private logFileParsePath = {
        actions: "./logs/osiris.parse.actions.log.txt",
        requests: "./logs/osiris.parse.requests.log.txt",
        evaluations: "./logs/osiris.parse.evaluations.log.txt"
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
            const requests = OsirisParser.parseRequests(fileContent);

            console.info(`Check ${requests.length} entities!`);
            requests.forEach((entity) => {
                const result = osirisService.validRequest(entity);
                if (!result.success) {
                    console.error(`${COLORS.FgRed}${result.message}${COLORS.Reset}`, result.data);
                }
            });

            console.info(`${COLORS.Reset}Validation done`);
        }
        else if (type === "actions") {
            const actions = OsirisParser.parseActions(fileContent);
            console.info(`Check ${actions.length} entities!`);
            actions.forEach((entity) => {
                const result = osirisService.validAction(entity);
                if (!result.success) {
                    console.error(`${COLORS.FgRed}${result.message}${COLORS.Reset}`, result.data);
                }
            });

            console.info(`${COLORS.Reset}Validation done`);
        } else {
            throw new Error(`The type ${type} is not found`);
        }
    }

    public async parse(type: "requests" | "actions" | "evaluations", file: string): Promise<unknown> {
        if (typeof type != "string" && typeof file != "string") {
            throw new Error("Parse command need type and file args");
        }
        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }
        const files = findFiles(file);
        const logs: unknown[] = [];

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${ this.logFileParsePath }`);

        return files.reduce((acc, filePath) => {
            return acc.then(() => this._parse(type, filePath, logs));
        }, Promise.resolve())
            .then(() => fs.writeFileSync(this.logFileParsePath[type], logs.join(''), { flag: "w", encoding: "utf-8" }));
    }

    protected async _parse(type: string, file: string, logs: unknown[]) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        if (type === "requests") {
            return this._parseRequest(fileContent, logs);
        } else if (type === "actions") {
            return this._parseAction(fileContent, logs);
        } else if (type === "evaluations") {
            return this._parseEvaluation(fileContent, logs);
        } else {
            throw new Error(`The type ${type} is not taken into account`);
        }
    }

    private async _parseRequest(contentFile: Buffer, logs: unknown[]) {
        const requests = OsirisParser.parseRequests(contentFile);
        const results = await requests.reduce(async (acc, osirisRequest, index) => {
            const data = await acc;
            let validation = osirisService.validRequest(osirisRequest);

            if (validation.code === 2) { // RNA NOT FOUND // TODO: use const for decribe error
                const rna = await rnaSirenService.getRna(osirisRequest.legalInformations.siret, true);

                if (typeof rna !== "string") {
                    logs.push(`\n\nThis request is not registered because: RNA not found\n`, JSON.stringify(osirisRequest.legalInformations, null, "\t"))
                    return data;
                }

                osirisRequest.legalInformations.rna = rna;
                validation = osirisService.validRequest(osirisRequest); // Re-validate with the new rna
            }

            CliHelper.printProgress(index + 1 , requests.length);

            if (!validation.success && validation.code != 2) {
                logs.push(`\n\nThis request is not registered because: ${validation.message}\n`, JSON.stringify(validation.data, null, "\t"));
            } else data.push( await osirisService.addRequest(osirisRequest));

            return data;
        }, Promise.resolve([]) as Promise<{ state: string, result: OsirisRequestEntity}[]>);

        const created = results.filter(({state}) => state === "created");
        console.info(`
            ${results.length}/${requests.length}
            ${created.length} requests created and ${results.length - created.length} requests updated
            ${requests.length - results.length} requests not valid
        `);
    }

    private async _parseAction(contentFile: Buffer, logs: unknown[]) {
        const actions = OsirisParser.parseActions(contentFile);
        const results = await actions.reduce(async (acc, osirisAction, index) => {
            const data = await acc;
            const validation = osirisService.validAction(osirisAction);

            CliHelper.printProgress(index + 1 , actions.length);

            if (!validation.success) {
                logs.push(`\n\nThis request is not registered because: ${validation.message}\n`, JSON.stringify(validation.data, null, "\t"));
            } else data.push(await osirisService.add(osirisAction));

            return data;
        }, Promise.resolve([]) as Promise<{
            state: string;
            result: OsirisActionEntity;
        }[]>)


        const created = results.filter(({state}) => state === "created");
        console.info(`
            ${results.length}/${actions.length}
            ${created.length} actions created and ${results.length - created.length} actions update
            ${actions.length - results.length} actions not valid
        `);
    }

    private async _parseEvaluation(contentFile: Buffer, logs: unknown[]) {
        
        const evaluations = OsirisParser.parseEvaluations(contentFile);

        const results = await evaluations.reduce(async (acc, entity, index) => {
            const data = await acc;
            const validation = osirisService.validEvaluation(entity);

            CliHelper.printProgress(index + 1 , evaluations.length);

            if (!validation.success) {
                logs.push(`\n\nThis request is not registered because: ${validation.message}\n`, JSON.stringify(validation.data, null, "\t"));
            } else data.push(await osirisService.addEvaluation(entity));

            return data;
        }, Promise.resolve([]) as Promise<{
            state: string;
            result: OsirisEvaluationEntity;
        }[]>)


        const created = results.filter(({state}) => state === "created");
        console.info(`
            ${results.length}/${evaluations.length}
            ${created.length} evaluation created and ${results.length - created.length} evaluations updated
            ${evaluations.length - results.length} evaluations not valid
        `);
    }

    async findBySiret(siret: Siret, format?: string) {
        if (typeof siret !== "string" ) {
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
        if (typeof rna !== "string" ) {
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