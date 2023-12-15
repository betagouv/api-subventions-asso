import fs from "fs";
import ExportDateError from "../../shared/errors/cliErrors/ExportDateError";
import ScdlGrantParser from "../../modules/providers/scdl/scdl.grant.parser";
import scdlService from "../../modules/providers/scdl/scdl.service";
import MiscScdlGrantEntity from "../../modules/providers/scdl/entities/MiscScdlGrantEntity";
import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";

export default class ScdlCli {
    static cmdName = "scdl";

    public async addProducer(producerId: string, producerName: string) {
        if (!producerId) throw Error("producer ID is mandatory");
        if (!producerName) throw Error("producer NAME is mandatory");
        if (await scdlService.getProducer(producerId)) throw new Error("Producer already exists");
        await scdlService.createProducer({ producerId, producerName, lastUpdate: new Date() });
        console.log(producerId);
    }

    public async parse(file: string, producerId: string, exportDate?: Date | undefined, delimeter = ";") {
        if (!exportDate) throw new ExportDateError();
        exportDate = new Date(exportDate);
        if (!(await scdlService.getProducer(producerId)))
            throw new Error("Producer ID does not match any producer in database");

        const fileContent = fs.readFileSync(file);

        const grants = ScdlGrantParser.parseCsv(fileContent, delimeter);

        console.log(`start persisting ${grants.length} grants`);
        const entities: MiscScdlGrantEntity[] = grants.map(grant => ({ ...grant, producerId: producerId }));
        let duplicates: MiscScdlGrantEntity[] = [];

        try {
            await scdlService.createManyGrants(entities);
        } catch (e) {
            if (!(e instanceof DuplicateIndexError)) throw e;
            duplicates = (e as DuplicateIndexError<MiscScdlGrantEntity[]>).duplicates;
        }
        console.log(`${duplicates.length} duplicated entries. Here are some of them: `);
        console.log(duplicates.slice(0, 5));
        await scdlService.updateProducer(producerId, { lastUpdate: exportDate });
    }
}
