import fs from "fs";

import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../@types";

import * as CliHelper from "../../../../shared/helpers/CliHelper";

import CliController from "../../../../shared/CliController";
import SubventiaParser from "../subventia.parser";
import subventiaService, { AcceptedRequest, RejectedRequest } from "../subventia.service";
import { SubventiaRequestEntity } from "../entities/SubventiaRequestEntity";

@StaticImplements<CliStaticInterface>()
export default class SubventiaCliController extends CliController {
    static cmdName = "subventia";

    protected logFileParsePath = "./logs/subventia.parse.log.txt";

    protected async _parse(file: string, logs: unknown[]) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const entities = SubventiaParser.parse(fileContent);

        console.info("Start register in database ...")

        const saveEntities = async (acc: Promise<(RejectedRequest | AcceptedRequest)[]> , entity: SubventiaRequestEntity, index: number) => {
            const data = await acc;
            CliHelper.printProgress(index + 1 , entities.length);
            data.push(await subventiaService.createEntity(entity));
            return data;
        }
        
        const results = await entities.reduce(saveEntities, Promise.resolve([]));

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