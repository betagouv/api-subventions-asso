import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import CliController from "../../../../../shared/CliController";
import GisproJoinParser from "../../gisproJoin.parser";

@StaticImplements<CliStaticInterface>()
export default class GisproJoinCliController extends CliController {
    static cmdName = "gisproJoin";

    protected logFileParsePath = "./logs/gisproJoin.parse.log.txt";

    /**
     * Tests parser
     * @param file path to file
     */
    public async test(file: string) {
        if (typeof file !== "string") {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        console.info("\nStart parse file: ", file);

        const fileContent = fs.readFileSync(file);

        const entities = GisproJoinParser.parse(fileContent, () => true);
    }
}
