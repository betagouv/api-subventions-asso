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
    }

    public async parse(file: string, producerId: string, exportDate?: Date | undefined, delimeter = ";") {
        if (!exportDate) throw new ExportDateError();
        exportDate = new Date(exportDate);
        if (!(await scdlService.getProducer(producerId)))
            throw new Error("Producer ID does not match any producer in database");

        const fileContent = fs.readFileSync(file);

        const entities = ScdlGrantParser.parseCsv(fileContent, delimeter);

        if (!entities) {
            throw new Error("No entities could be created from this files");
        }

        console.log(`start persisting ${entities.length} grants`);
        let duplicates: MiscScdlGrantEntity[] = [];

        try {
            await scdlService.createManyGrants(entities, producerId);
        } catch (e) {
            if (!(e instanceof DuplicateIndexError)) throw e;
            duplicates = (e as DuplicateIndexError<MiscScdlGrantEntity[]>).duplicates;
        }
        console.log(`${duplicates.length} duplicated entries. Here are some of them: `);
        console.log(duplicates.slice(0, 5));
        console.log("Updating producer's last update date");
        await scdlService.updateProducer(producerId, { lastUpdate: exportDate });
        console.log("Parsing ended successfuly !");
    }
}
