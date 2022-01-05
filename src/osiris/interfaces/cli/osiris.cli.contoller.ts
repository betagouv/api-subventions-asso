import fs from "fs";


import { StaticImplements } from "../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../@types/Cli.interface";
import OsirisParser from "../../osiris.parser";
import osirisService from "../../osiris.service";
import OsirisFolderEntity from "../../entities/OsirisFoldersEntity";


@StaticImplements<CliStaticInterface>()
export default class OsirisCliController {
    static cmdName = "osiris";

    public async parse(type: string, file: string) {
        if (typeof type !== "string" || typeof file !== "string" ) {
            throw new Error("Parse command neet type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        if (type === "folders") {
            const folders = OsirisParser.parseFolders(fileContent);
            return folders.reduce((acc, osirisFolder) => {
                return acc.then(
                    (data = []) => {
                        return osirisService.addFolder(osirisFolder).then((result) => data.concat(result))
                    }
                );
            }, Promise.resolve([]) as Promise<{
                state: string;
                result: OsirisFolderEntity;
            }[]>).then(results => {
                const created = results.filter(({state}) => state === "created");
                console.info(`${created.length} folders created and ${results.length - created.length} folders updated`);
            });
        } else if (type === "actions") {
            console.warn("Please implement me !");
        } else {
            throw new Error(`The type ${type} is not taken into account`);
        }
    }

    async findAll(format? :string) {
        const folders = await osirisService.findAll();

        if (format === "json") {
            console.info(JSON.stringify(folders));
        } else {
            console.info(folders);
        }
    }

    async findBySiret(siret: string, format?: string) {
        if (typeof siret !== "string" ) {
            throw new Error("Parse command need siret args");
        }

        const folder = await osirisService.findBySiret(siret);


        if (format === "json") {
            console.info(JSON.stringify(folder));
        } else {
            console.info(folder);
        }
    }

    async findByRna(rna: string, format?: string) {
        if (typeof rna !== "string" ) {
            throw new Error("Parse command need rna args");
        }

        const folder = await osirisService.findByRna(rna);


        if (format === "json") {
            console.info(JSON.stringify(folder));
        } else {
            console.info(folder);
        }
    }
}