import fs from "fs";
import tqdm from "tqdm";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import CliController from "../../../../../shared/CliController";
import GisproParser from "../../gispro.parser";
import { asyncForEach } from "../../../../../shared/helpers/ArrayHelper";
import dauphinService from "../../../dauphin/dauphin.service";
import { printAtSameLine } from "../../../../../shared/helpers/CliHelper";

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

    protected async _parse(file: string) {
        this.logger.logIC("\nStart parse file: ", file);

        const fileContent = fs.readFileSync(file);

        const entities = GisproParser.parse(fileContent, () => true);

        this.logger.logIC(entities.length + " entities founds");

        this.logger.logIC("Start save entities");

        for await (const entity of tqdm(entities)) {
            await dauphinService.insertGisproEntity(entity);
        }

        this.logger.logIC("\nEntities has been save");
    }
}
