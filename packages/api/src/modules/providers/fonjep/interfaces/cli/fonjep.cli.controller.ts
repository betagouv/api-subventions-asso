import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../../@types";
import FonjepParser from "../../fonjep.parser";
import fonjepService, { RejectedRequest } from "../../fonjep.service";
import FonjepRequestEntity from "../../entities/FonjepRequestEntity";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import CliController from '../../../../../shared/CliController';

@StaticImplements<CliStaticInterface>()
export default class FonjepCliController extends CliController {
    static cmdName = "fonjep";

    protected logFileParsePath = "./logs/fonjep.parse.log.txt";

    // Called in CliController parse()
    protected async _parse(file: string, logs: unknown[], exportDate: string) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const entities = FonjepParser.parse(fileContent, exportDate);

        console.info("Start register in database ...")
        
        const results = await entities.reduce(async (acc, entity, index) => {
            const data = await acc;
            CliHelper.printProgress(index + 1 , entities.length)
            data.push(await fonjepService.createEntity(entity));
            return data;
        }, Promise.resolve([]) as Promise<
        ({
            success: true,
            state: string,
            entity: FonjepRequestEntity
        } 
        | RejectedRequest)[]>)

        const created = results.filter((result) => result.success && result.state === "created");
        const updated = results.filter((result) => result.success && result.state === "updated");
        const rejected = results.filter((result) => !result.success) as RejectedRequest[];

        console.info(`
            ${results.length}/${entities.length}
            ${created.length} requests created and ${updated.length} requests updated
            ${rejected.length} requests not valid
        `);

        rejected.forEach((result) => {
            logs.push(`\n\nThis request is not registered because: ${result.message}\n`, JSON.stringify(result.data, null, "\t"))
        });
    } 
}