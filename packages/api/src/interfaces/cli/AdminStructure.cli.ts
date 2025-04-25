import fs from "fs";

import { CliStaticInterface } from "../../@types";
import CliController from "../../shared/CliController";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import AdminStructureParser from "../../modules/admin-structure/adminStructure.parser";
import adminStructureService from "../../modules/admin-structure/adminStructure.service";

@StaticImplements<CliStaticInterface>()
export default class AdminStructureCli extends CliController {
    static cmdName = "admin-structure";

    public async parseXls(path: string) {
        console.info("\nStart parse file: ", path);

        const fileContent = fs.readFileSync(path);

        const entities = AdminStructureParser.parseXls(fileContent);

        console.info(`${entities.length} entities found in file.`);

        console.info("Start register in database ...");

        await adminStructureService.replaceAll(entities);

        console.info("Entries registered");
    }
}
