import fs from "fs";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import { asyncForEach } from "../../shared/helpers/ArrayHelper";

import { SubventiaDbo } from "../../modules/providers/subventia/@types/ISubventiaIndexedInformation";

//import SubventiaParser from "../../modules/providers/subventia/subventia.parser";

import * as CliHelper from "../../shared/helpers/CliHelper";

import CliController from "../../shared/CliController";
import subventiaService from "../../modules/providers/subventia/subventia.service";
import SubventiaParser from "../../modules/providers/subventia/subventia.parser";
import SubventiaValidator from "../../modules/providers/subventia/validators/subventia.validator";
import SubventiaAdapter from "../../modules/providers/subventia/adapters/subventiaAdapter";

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

        // mettre la partie dessus -> dans parse

        const parsedData = SubventiaParser.parse(file);

        const sortedData = SubventiaValidator.sortDataByValidity(parsedData);
        /*
        const entities = SubventiaAdapter.getApplications(sortedData['valids']);

        const totalEntities = entities.length;


    

        await asyncForEach(entities, async (entity, index) => {
            CliHelper.printProgress(index * 1000, totalEntities);
            await subventiaService.createEntity(entity);
      
        });
        
        
        */
    }
}
