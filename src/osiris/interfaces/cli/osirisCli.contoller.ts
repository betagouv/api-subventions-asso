import fs from "fs";


import { StaticImplements } from "../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../@types/Cli.interface";
import OsirisParser from "../../osiris.parser";
import osirisService from "../../osiris.service";


@StaticImplements<CliStaticInterface>()
export default class OsirisCliController {
    static cmdName = "osiris";

    parse(type: string, file: string) {
        if (typeof type !== "string" || typeof file !== "string" ) {
            throw new Error("Parse command neet type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        const folders = OsirisParser.parseFolders(fileContent);

        folders.forEach(osirisFolder => osirisService.addFolder(osirisFolder));
    }
}