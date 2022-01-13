import fs from "fs";
import path from "path";

import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../@types/Cli.interface";
import OsirisParser from "../../osiris.parser";
import osirisService from "../../osiris.service";
import OsirisActionEntity from "../../entities/OsirisActionEntity";
import OsirisRequestEntity from "../../entities/OsirisRequestEntity";
import { COLORS } from "../../../../shared/LogOptions";
import * as RnaHelper from "../../../../shared/helpers/RnaHelper";


@StaticImplements<CliStaticInterface>()
export default class OsirisCliController {
    static cmdName = "osiris";

    private logFileParsePath = {
        actions: "./logs/osiris.parse.actions.log.txt",
        requests: "./logs/osiris.parse.requests.log.txt",
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
                    console.error(`${COLORS.FgRed}${result.msg}${COLORS.Reset}`, result.data);
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
                    console.error(`${COLORS.FgRed}${result.msg}${COLORS.Reset}`, result.data);
                }
            });

            console.info(`${COLORS.Reset}Validation done`);
        } else {
            throw new Error(`The type ${type} is not found`);
        }
    }

    public async parse(type: "actions" | "requests", file: string): Promise<unknown> {
        if (typeof type !== "string" || typeof file !== "string" ) {
            throw new Error("Parse command need type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files = [];

        if (fs.lstatSync(file).isDirectory()) {
            const filesInFolder = fs
                .readdirSync(file)
                .filter(fileName => !fileName.startsWith(".") && !fs.lstatSync(path.join(file, fileName)).isDirectory())
                .map((fileName => path.join(file, fileName)));

            files.push(...filesInFolder);
        } else files.push(file);

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
        } else if (type === "actions") {
            return this._parseAction(fileContent, logs);
        } else {
            throw new Error(`The type ${type} is not taken into account`);
        }
    }

    private async _parseRequest(contentFile: Buffer, logs: unknown[]) {
        const requests = OsirisParser.parseRequests(contentFile);
        const results = await requests.reduce(async (acc, osirisRequest) => {
            const data = await acc;
            let validation = osirisService.validRequest(osirisRequest);

            if (validation.code === 2) { // RNA NOT FOUND // TODO: use const for decribe error
                const rna = await RnaHelper.findRnaBySiret(osirisRequest.legalInformations.siret, true);

                if (typeof rna !== "string") {
                    if (rna.code === RnaHelper.ERRORS_CODES.RNA_NOT_FOUND) {
                        logs.push(`\n\nThis request is not registered because: RNA not found\n`, JSON.stringify(osirisRequest.legalInformations, null, "\t"))
                    }
                    return data;
                }

                osirisRequest.legalInformations.rna = rna as string;
                validation = osirisService.validRequest(osirisRequest); // Re-validate with the new rna
            }

            if (!validation.success && validation.code != 2) {
                logs.push(`\n\nThis request is not registered because: ${validation.msg}\n`, JSON.stringify(validation.data, null, "\t"));
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
        const results = await actions.reduce(async (acc, osirisAction) => {
            const data = await acc;
            const validation = osirisService.validAction(osirisAction);

            if (!validation.success) {
                logs.push(`\n\nThis request is not registered because: ${validation.msg}\n`, JSON.stringify(validation.data, null, "\t"));
            } else data.push(await osirisService.addAction(osirisAction));

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

    async findAll(type:string, format? :string) {
        if (typeof type !== "string") {
            throw new Error("FindAll command need type args");
        }

        let data: Array<OsirisActionEntity | OsirisRequestEntity> = [];

        if (type === "requests") {
            data = await osirisService.findAllRequests();
        } else if (type === "actions") {
            data = await osirisService.findAllActions();
        }

        if (format === "json") {
            console.info(JSON.stringify(data));
        } else {
            console.info(data);
        }
    }

    async findBySiret(siret: string, format?: string) {
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

    async findByRna(rna: string, format?: string) {
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