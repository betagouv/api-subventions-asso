import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import { asyncForEach } from "../../shared/helpers/ArrayHelper";
import * as CliHelper from "../../shared/helpers/CliHelper";

import CliController from "../../shared/CliController";
import subventiaService from "../../modules/providers/subventia/subventia.service";

@StaticImplements<CliStaticInterface>()
export default class SubventiaCli extends CliController {
    static cmdName = "subventia";
    protected _providerIdToLog = subventiaService.provider.id;

    protected logFileParsePath = "./logs/subventia.parse.log.txt";

    protected async _parse(file: string, logs, exportDate) {
        const entities = subventiaService.processSubventiaData(file, new Date(exportDate));

        const totalEntities = entities.length;

        await asyncForEach(entities, async (entity, index) => {
            CliHelper.printProgress(index + 1, totalEntities);
            await subventiaService.createEntity(entity);
        });
    }
}
