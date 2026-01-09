import fs from "fs";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import CliController from "../../shared/CliController";
import GisproParser from "../../modules/providers/dauphin-gispro/gispro.parser";
import gisproService from "../../modules/providers/dauphin-gispro/gispro.service";

@StaticImplements<CliStaticInterface>()
export default class GisproCli extends CliController {
    static cmdName = "gispro";

    protected _serviceMeta = gisproService.meta;

    protected logFileParsePath = "./logs/gispro.parse.log.txt";

    /**
     * Tests parser
     * @param file path to file
     */
    public async test(file: string, year: string) {
        if (typeof file !== "string") {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        console.info("\nStart parse file: ", file);

        const fileContent = fs.readFileSync(file);

        GisproParser.parse(fileContent, parseInt(year));
    }

    protected async _parse(file: string, logs: unknown[], exportDate: Date, ..._args) {
        this.logger.logIC("\nStart parse file: ", file);

        const exercise = exportDate.getFullYear();

        const fileContent = fs.readFileSync(file);

        await gisproService.parseSaveXls(fileContent, exercise);
    }
}
