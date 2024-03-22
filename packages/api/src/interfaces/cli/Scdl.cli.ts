import fs from "fs";
import { Siret } from "dto";
import ExportDateError from "../../shared/errors/cliErrors/ExportDateError";
import ScdlGrantParser from "../../modules/providers/scdl/scdl.grant.parser";
import scdlService from "../../modules/providers/scdl/scdl.service";
import MiscScdlGrantEntity from "../../modules/providers/scdl/entities/MiscScdlGrantEntity";
import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import { isSiret } from "../../shared/Validators";

export default class ScdlCli {
    static cmdName = "scdl";

    public async addProducer(slug: string, name: string, siret: Siret) {
        if (!slug) throw Error("producer ID is mandatory");
        if (!name) throw Error("producer NAME is mandatory");
        if (!siret) throw Error("producer SIRET is mandatory");
        if (!isSiret(siret)) throw Error("SIRET is not valid");
        if (await scdlService.getProducer(slug)) throw new Error("Producer already exists");
        await scdlService.createProducer({ slug, name, siret, lastUpdate: new Date() });
    }

    public async parse(file: string, slug: string, exportDate?: Date | undefined, delimeter = ";") {
        if (!exportDate) throw new ExportDateError();
        exportDate = new Date(exportDate);
        if (!(await scdlService.getProducer(slug)))
            throw new Error("Producer ID does not match any producer in database");

        const fileContent = fs.readFileSync(file);

        const entities = ScdlGrantParser.parseCsv(fileContent, delimeter);

        if (!entities) {
            throw new Error("No entities could be created from this files");
        }

        console.log(`start persisting ${entities.length} grants`);
        let duplicates: MiscScdlGrantEntity[] = [];

        try {
            await scdlService.createManyGrants(entities, slug);
        } catch (e) {
            if (!(e instanceof DuplicateIndexError)) throw e;
            duplicates = (e as DuplicateIndexError<MiscScdlGrantEntity[]>).duplicates;
        }

        if (duplicates.length) {
            console.log(`${duplicates.length} duplicated entries. Here are some of them: `);
            console.log(duplicates.slice(0, 5));
        } else {
            console.log(`No duplicates detected`);
        }

        console.log("Updating producer's last update date");
        await scdlService.updateProducer(slug, { lastUpdate: exportDate });
        console.log("Parsing ended successfuly !");
    }
}
