import fs from "fs";
import CliController from "../../../../../shared/CliController";
import ExportDateError from "../../../../../shared/errors/cliErrors/ExportDateError";
import ScdlGrantParser from "../../scdl.grant.parser";
import scdlService from "../../scdl.service";
import MiscScdlGrantEntity from "../../entities/MiscScdlGrantEntity";

export default class ScdlCliController extends CliController {
    static cmdName = "scdl";

    protected async _parse(file: string, logs: unknown[], exportDate?: Date | undefined) {
        if (!exportDate) throw new ExportDateError();
        this.logger.logIC("\nStart parse file: ", file);
        this.logger.log(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const grants = ScdlGrantParser.parseCsv(fileContent);

        this.logger.log(`adding ${grants.length} grants in db`);

        const producerId = "";
        const entities: MiscScdlGrantEntity[] = grants.map(grant => ({ ...grant, producerId: producerId }));
        await scdlService.createManyGrants(entities);

        this.logger.log(`parsing done`);
    }
}
