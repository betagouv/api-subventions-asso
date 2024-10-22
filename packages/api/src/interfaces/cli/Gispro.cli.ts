import fs from "fs";
import tqdm from "tqdm";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import CliController from "../../shared/CliController";
import GisproParser from "../../modules/providers/gispro/gispro.parser";
import dauphinService from "../../modules/providers/dauphin/dauphin.service";

@StaticImplements<CliStaticInterface>()
export default class GisproCli extends CliController {
    static cmdName = "gispro";

    protected _providerIdToLog = dauphinService.provider.id;

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

        GisproParser.parse(fileContent, parseInt(year), () => true);
    }

    protected async _parse(file: string, logs: unknown[], exportDate?: Date, ...args) {
        this.logger.logIC("\nStart parse file: ", file);

        const year = parseInt(args[0]);

        const fileContent = fs.readFileSync(file);

        const entities = GisproParser.parse(fileContent, year, () => true);

        this.logger.logIC(entities.length + " entities founds");

        this.logger.logIC("Start save entities");

        for await (const entity of tqdm(entities)) {
            await dauphinService.insertGisproApplicationEntity(entity);
        }

        this.logger.logIC("\nEntities has been saved");
    }
}
