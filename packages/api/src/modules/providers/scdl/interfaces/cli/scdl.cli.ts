import fs from "fs";
import ExportDateError from "../../../../../shared/errors/cliErrors/ExportDateError";
import ScdlGrantParser from "../../scdl.grant.parser";
import scdlService from "../../scdl.service";
import MiscScdlGrantEntity from "../../entities/MiscScdlGrantEntity";
import { NotFoundError } from "../../../../../shared/errors/httpErrors";

export default class ScdlCliController {
    static cmdName = "scdl";

    public async addProducer(producerId, producerName) {
        await scdlService.createProducer({ producerId, producerName, lastUpdate: new Date() });
        console.log(producerId);
    }

    public async parse(file: string, producerId: string, exportDate?: Date | undefined) {
        if (!exportDate) throw new ExportDateError();

        if (!(await scdlService.getProducer(producerId)))
            throw new NotFoundError("Producer ID does not match any producer in database");

        const fileContent = fs.readFileSync(file);

        const grants = ScdlGrantParser.parseCsv(fileContent);

        console.log(`start persisting ${grants.length} grants`);
        const entities: MiscScdlGrantEntity[] = grants.map(grant => ({ ...grant, producerId: producerId }));
        await scdlService.createManyGrants(entities);
    }
}
