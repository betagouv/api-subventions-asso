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

    protected async _parse(file: string) {
        this.logger.log(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);
        this.logger.logIC("\nStart parse file: ", file);

        const fileContent = fs.readFileSync(file);

        const entities = SubventiaParser.parse(fileContent);

        this.logger.logIC("Start register in database ...");

        const saveEntities = async (
            acc: Promise<(RejectedRequest | AcceptedRequest)[]>,
            entity: SubventiaRequestEntity,
            index: number
        ) => {
            const data = await acc;
            CliHelper.printProgress(index + 1, entities.length);
            data.push(await subventiaService.createEntity(entity));
            return data;
        };

        const results = await entities.reduce(saveEntities, Promise.resolve([]));

        const created = results.filter(result => result.success) as AcceptedRequest[];
        const rejected = results.filter(result => !result.success) as RejectedRequest[];

        this.logger.logIC(`
            ${results.length}/${entities.length}
            ${created.length} requests created
            ${rejected.length} requests not valid
        `);

        rejected.forEach(result => {
            this.logger.log(
                `\n\nThis request is not registered because: ${result.message}\n`,
                JSON.stringify(result.data, null, "\t")
            );
        });
    }
}
