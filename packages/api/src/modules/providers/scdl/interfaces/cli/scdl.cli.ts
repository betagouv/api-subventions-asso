import fs from "fs";
import ExportDateError from "../../../../../shared/errors/cliErrors/ExportDateError";
import ScdlGrantParser from "../../scdl.grant.parser";
import scdlService from "../../scdl.service";
import MiscScdlGrantEntity from "../../entities/MiscScdlGrantEntity";

export default class ScdlCliController {
    static cmdName = "scdl";

    public async addProducer(producerId, producerName) {
        if (!producerId) throw Error("producer ID is mandatory");
        if (!producerName) throw Error("producer NAME is mandatory");
        if (await scdlService.getProducer(producerId)) throw new Error("Producer already exists");
        await scdlService.createProducer({ producerId, producerName, lastUpdate: new Date() });
        console.log(producerId);
    }

    public async parse(file: string, producerId: string, exportDate?: Date | undefined) {
        if (!exportDate) throw new ExportDateError();
        exportDate = new Date(exportDate);
        if (!(await scdlService.getProducer(producerId)))
            throw new Error("Producer ID does not match any producer in database");

        const fileContent = fs.readFileSync(file);

        const grants = ScdlGrantParser.parseCsv(fileContent);

        console.log(`start persisting ${grants.length} grants`);
        const entities: MiscScdlGrantEntity[] = grants.map(grant => ({ ...grant, producerId: producerId }));
        await scdlService.createManyGrants(entities);
        await scdlService.updateProducer(producerId, { lastUpdate: exportDate });
    }
}
