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

        if (type === "folders") {
            const folders = OsirisParser.parseFiles(fileContent);
            return folders.reduce((acc, osirisFile) => {
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
                console.info(`${created.length} folders created and ${results.length - created.length} folders updated`);
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

        if (type === "folders") {
            data = await osirisService.findAllFiles();
        } else if (type === "actions") {
            data = await osirisService.findAllFiles();
        }

        if (format === "json") {
            console.info(JSON.stringify(data));
        } else {
            console.info(data);
        }
    }

    async findFileBySiret(siret: string, format?: string) {
        if (typeof siret !== "string" ) {
            throw new Error("Parse command need siret args");
        }

        const folder = await osirisService.findFileBySiret(siret);


        if (format === "json") {
            console.info(JSON.stringify(folder));
        } else {
            console.info(folder);
        }
    }

    async findFileByRna(rna: string, format?: string) {
        if (typeof rna !== "string" ) {
            throw new Error("Parse command need rna args");
        }

        const folder = await osirisService.findFileByRna(rna);


        if (format === "json") {
            console.info(JSON.stringify(folder));
        } else {
            console.info(folder);
        }
    }
}