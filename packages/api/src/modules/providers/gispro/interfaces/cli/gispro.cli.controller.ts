import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import CliController from "../../../../../shared/CliController";
import GisproParser from "../../gispro.parser";

@StaticImplements<CliStaticInterface>()
export default class GisproCliController extends CliController {
    static cmdName = "gispro";

    protected logFileParsePath = "./logs/gispro.parse.log.txt";

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

        const entities = GisproParser.parse(fileContent, () => true);
    }
}
