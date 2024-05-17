import fs from "fs";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

//import SubventiaParser from "../../modules/providers/subventia/subventia.parser";

import * as CliHelper from "../../shared/helpers/CliHelper";

import CliController from "../../shared/CliController";
import subventiaService from "../../modules/providers/subventia/subventia.service";
import SubventiaParser from "../../modules/providers/subventia/subventia.parser";
/*import subventiaService, {
    AcceptedRequest,
    RejectedRequest,
} from "../../modules/providers/subventia/subventia.service";
import { SubventiaRequestEntity } from "../../modules/providers/subventia/entities/SubventiaRequestEntity";
*/
@StaticImplements<CliStaticInterface>()
export default class SubventiaCli extends CliController {
    static cmdName = "subventia";

    protected logFileParsePath = "./logs/subventia.parse.log.txt";

    protected async _parse(file: string, logs, exportDate) {
        if (typeof file !== "string") {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        console.info("\nStart parse file: ", file);

        const fileContent = fs.readFileSync(file);
        console.log(SubventiaParser.parse(fileContent));

        //     const entities = SubventiaParser.parse(fileContent);
        //   const totalEntities = entities.length;

        /*       const saveEntities = async (
            acc: Promise<(RejectedRequest | AcceptedRequest)[]>,
            entity: SubventiaRequestEntity,
            index: number,
        ) => {
            const data = await acc;
            CliHelper.printProgress(index + 1, entities.length);
            data.push(await subventiaService.createEntity(entity));
            return data;
        };

        const results = await entities.reduce(saveEntities, Promise.resolve([]));

        const created = results.filter(result => (result as AcceptedRequest).state === "created") as AcceptedRequest[];
        const rejected = results.filter(result => (result as RejectedRequest).message) as RejectedRequest[];

        this.logger.logIC(`
            ${results.length}/${entities.length}
            ${created.length} requests created
            ${rejected.length} requests not valid
        `);

        rejected.forEach(result => {
            this.logger.log(
                `\n\nThis request is not registered because: ${result.message}\n`,
                JSON.stringify(result.data, null, "\t"),
            );
        });
        */
    }
}
