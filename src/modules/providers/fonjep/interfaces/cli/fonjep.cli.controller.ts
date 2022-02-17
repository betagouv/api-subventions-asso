import fs from "fs";
import path from "path";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../../@types/Cli.interface";
import { findFiles } from "../../../../../shared/helpers/ParserHelper";

@StaticImplements<CliStaticInterface>()
export default class FonjepCliController {
    static cmdName = "fonjep";

    private logFileParsePath = "./logs/fonjep.parse.log.txt";

    public async parse(file: string): Promise<unknown> {
        if (typeof file !== "string" ) {
            throw new Error("Parse command need type and file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files = findFiles(file);
        console.log(files)
        return;
    }
}