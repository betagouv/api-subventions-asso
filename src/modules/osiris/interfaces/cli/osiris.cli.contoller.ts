import fs from "fs";


import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../@types/Cli.interface";
import OsirisParser from "../../osiris.parser";
import osirisService from "../../osiris.service";
import OsirisFileEntity from "../../entities/OsirisFileEntity";
import OsirisActionEntity from "../../entities/OsirisActionEntity";


@StaticImplements<CliStaticInterface>()
export default class OsirisCliController {
    static cmdName = "osiris";

    public async parse(type: string, file: string) {
        if (typeof type !== "string" || typeof file !== "string" ) {
            throw new Error("Parse command need type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        if (type === "files") {
            const files = OsirisParser.parseFiles(fileContent);
            return files.reduce((acc, osirisFile) => {
                return acc.then(
                    (data = []) => {
                        return osirisService.addFile(osirisFile).then((result) => data.concat(result))
                    }
                );
            }, Promise.resolve([]) as Promise<{
                state: string;
                result: OsirisFileEntity;
            }[]>).then(results => {
                const created = results.filter(({state}) => state === "created");
                console.info(`${created.length} files created and ${results.length - created.length} files updated`);
            });
        } else if (type === "actions") {
            const actions = OsirisParser.parseActions(fileContent);
            return actions.reduce((acc, osirisAction) => {
                return acc.then(
                    (data = []) => {
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
            throw new Error("Parse command need type args");
        }

        let data: Array<OsirisActionEntity | OsirisFileEntity> = [];

        if (type === "files") {
            data = await osirisService.findAllFiles();
        } else if (type === "actions") {
            data = await osirisService.findAllActions();
        }

        if (format === "json") {
            console.info(JSON.stringify(data));
        } else {
            console.info(data);
        }
    }

    async findFilesBySiret(siret: string, format?: string) {
        if (typeof siret !== "string" ) {
            throw new Error("Parse command need siret args");
        }

        const file = await osirisService.findFilesBySiret(siret);


        if (format === "json") {
            console.info(JSON.stringify(file));
        } else {
            console.info(file);
        }
    }

    async findFilesByRna(rna: string, format?: string) {
        if (typeof rna !== "string" ) {
            throw new Error("Parse command need rna args");
        }

        const files = await osirisService.findFilesByRna(rna);


        if (format === "json") {
            console.info(JSON.stringify(files));
        } else {
            console.info(files);
        }
    }
}