import fs from "fs";
import { Siret } from "dto";
import ExportDateError from "../../shared/errors/cliErrors/ExportDateError";
import ScdlGrantParser from "../../modules/providers/scdl/scdl.grant.parser";
import scdlService from "../../modules/providers/scdl/scdl.service";
import MiscScdlGrantEntity from "../../modules/providers/scdl/entities/MiscScdlGrantEntity";
import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import { isSiret } from "../../shared/Validators";
import { ScdlStorableGrant } from "../../modules/providers/scdl/@types/ScdlStorableGrant";

export default class ScdlCli {
    static cmdName = "scdl";

    public async addProducer(slug: string, name: string, siret: Siret) {
        if (!slug) throw Error("producer SLUG is mandatory");
        if (!name) throw Error("producer NAME is mandatory");
        if (!siret) throw Error("producer SIRET is mandatory");
        if (!isSiret(siret)) throw Error("SIRET is not valid");
        if (await scdlService.getProducer(slug)) throw new Error("Producer already exists");
        await scdlService.createProducer({ slug, name, siret, lastUpdate: new Date() });
    }

    public async parseXls(file: string, producerSlug: string, exportDate?: string, pageName?: string, rowOffset = 0) {
        await this.genericSanitizeInput(file, producerSlug, exportDate);
        const fileContent = fs.readFileSync(file);
        const entities = ScdlGrantParser.parseExcel(fileContent, pageName, rowOffset);
        return this.persistEntities(entities, producerSlug, exportDate as string);
    }

    public async parse(file: string, producerSlug: string, exportDate?: string, delimiter = ";") {
        await this.genericSanitizeInput(file, producerSlug, exportDate);
        const fileContent = fs.readFileSync(file);
        const entities = ScdlGrantParser.parseCsv(fileContent, delimiter);
        return this.persistEntities(entities, producerSlug, exportDate as string);
    }

    private async genericSanitizeInput(file: string, producerSlug: string, exportDateStr?: string) {
        if (!exportDateStr) throw new ExportDateError();
        const exportDate = new Date(exportDateStr);
        if (isNaN(exportDate.getTime())) throw new ExportDateError();
        if (!(await scdlService.getProducer(producerSlug)))
            throw new Error("Producer ID does not match any producer in database");
    }

    private async persistEntities(entities: ScdlStorableGrant[], producerSlug: string, exportDateStr: string) {
        if (!entities) throw new Error("No entities could be created from this file");

        console.log(`start persisting ${entities.length} grants`);
        let duplicates: MiscScdlGrantEntity[] = [];

        try {
            await scdlService.createManyGrants(entities, producerSlug);
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
        await scdlService.updateProducer(producerSlug, { lastUpdate: new Date(exportDateStr) });
        console.log("Parsing ended successfully !");
    }
}
