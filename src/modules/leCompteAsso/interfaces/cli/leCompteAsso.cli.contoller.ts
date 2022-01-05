import fs from "fs";


import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../@types/Cli.interface";
import LeCompteAssoParser from "../../leCompteAsso.parser";

@StaticImplements<CliStaticInterface>()
export default class LeCompteAssoCliController {
    static cmdName = "leCompteAsso";

    public async parse(file: string) {
        if (typeof file !== "string" ) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        const files = LeCompteAssoParser.parse(fileContent);
        console.log(files[0]);
        // const folders = OsirisParser.parseFiles(fileContent);
        // return folders.reduce((acc, osirisFile) => {
        //     return acc.then(
        //         (data = []) => {
        //             return osirisService.addFile(osirisFile).then((result) => data.concat(result))
        //         }
        //     );
        // }, Promise.resolve([]) as Promise<{
        //     state: string;
        //     result: OsirisFileEntity;
        // }[]>).then(results => {
        //     const created = results.filter(({state}) => state === "created");
        //     console.info(`${created.length} folders created and ${results.length - created.length} folders updated`);
        // });
    }

}