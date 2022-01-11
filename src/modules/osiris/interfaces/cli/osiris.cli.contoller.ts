import fs from "fs";


import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../@types/Cli.interface";
import OsirisParser from "../../osiris.parser";
import osirisService from "../../osiris.service";
import OsirisActionEntity from "../../entities/OsirisActionEntity";
import OsirisRequestEntity from "../../entities/OsirisRequestEntity";
import { COLORS } from "../../../../shared/LogOptions";


@StaticImplements<CliStaticInterface>()
export default class OsirisCliController {
    static cmdName = "osiris";

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

    public async parse(type: string, file: string) {
        if (typeof type !== "string" || typeof file !== "string" ) {
            throw new Error("Parse command need type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        if (type === "requests") {
            const requests = OsirisParser.parseRequests(fileContent);
            return requests.reduce((acc, osirisRequest) => {
                return acc.then(
                    (data = []) => {
                        const result = osirisService.validRequest(osirisRequest);
                        if (!result.success) {
                            console.info(`This request is not registered because: ${COLORS.FgRed}${result.msg}${COLORS.Reset}`, result.data);
                            return Promise.resolve(data);
                        }
                        return osirisService.addRequest(osirisRequest).then((result) => data.concat(result))
                    }
                );
            }, Promise.resolve([]) as Promise<{
                state: string;
                result: OsirisRequestEntity;
            }[]>).then(results => {
                const created = results.filter(({state}) => state === "created");
                console.info(`${created.length} requests created and ${results.length - created.length} requests updated`);
            });
        } else if (type === "actions") {
            const actions = OsirisParser.parseActions(fileContent);
            return actions.reduce((acc, osirisAction) => {
                return acc.then(
                    (data = []) => {
                        const result = osirisService.validAction(osirisAction);
                        if (!result.success) {
                            console.info(`This request is not registered because: ${COLORS.FgRed}${result.msg}${COLORS.Reset}`, result.data);
                            return Promise.resolve(data);
                        }
                        return osirisService.addAction(osirisAction).then((result) => data.concat(result))
                    }
                );
            }, Promise.resolve([]) as Promise<{
                state: string;
                result: OsirisActionEntity;
            }[]>).then(results => {
                const created = results.filter(({state}) => state === "created");
                console.info(`${created.length} actions created and ${results.length - created.length} actions updated`);
            });
        } else {
            throw new Error(`The type ${type} is not taken into account`);
        }
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