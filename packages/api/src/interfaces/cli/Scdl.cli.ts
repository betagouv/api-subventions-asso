import fs from "fs";
import path from "path";
import csvSyncStringifier = require("csv-stringify/sync");
import ScdlGrantParser from "../../modules/providers/scdl/scdl.grant.parser";
import scdlService from "../../modules/providers/scdl/scdl.service";
import MiscScdlGrantEntity from "../../modules/providers/scdl/entities/MiscScdlGrantEntity";
import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import { ScdlStorableGrant } from "../../modules/providers/scdl/@types/ScdlStorableGrant";
import Siret from "../../valueObjects/Siret";
import { ParsedDataWithProblem } from "../../modules/providers/scdl/@types/Validation";
import { DEV } from "../../configurations/env.conf";
import dataLogService from "../../modules/data-log/dataLog.service";
import { validateDate } from "../../shared/helpers/CliHelper";

export default class ScdlCli {
    static cmdName = "scdl";

    // relative path refers to package's root
    static errorsFolderName = "./import-errors";

    public async addProducer(slug: string, name: string, siret: string) {
        if (!slug) throw Error("producer SLUG is mandatory");
        if (!name) throw Error("producer NAME is mandatory");
        if (!siret) throw Error("producer SIRET is mandatory");
        if (!Siret.isSiret(siret)) throw Error("SIRET is not valid");
        if (await scdlService.getProducer(slug)) throw new Error("Producer already exists");
        await scdlService.createProducer({ slug, name, siret, lastUpdate: new Date() });
    }

    public async parseXls(
        file: string,
        producerSlug: string,
        exportDate: string | undefined = undefined,
        pageName: string | undefined = undefined,
        rowOffset: number | string = 0,
    ) {
        await this.validateGenericInput(producerSlug, exportDate);
        const parsedRowOffset = typeof rowOffset === "number" ? rowOffset : parseInt(rowOffset);
        const fileContent = fs.readFileSync(file);
        const { entities, errors } = ScdlGrantParser.parseExcel(fileContent, pageName, parsedRowOffset);
        await Promise.all([this.persistEntities(entities, producerSlug), this.exportErrors(errors, file)]);
        await dataLogService.addLog(producerSlug, file, exportDate ? new Date(exportDate) : undefined);
    }

    /**
     *
     * @param file (string) : Name of the file to import
     * @param producerSlug (string) : Slug of the file producer
     * @param exportDate  (string | format YYYY-MM-DD | optionnal) : IF PROVIDED => date of production or end date of covered period
     * @param delimiter
     * @param quote
     */
    public async parse(
        file: string,
        producerSlug: string,
        exportDate: string | undefined = undefined,
        delimiter = ";",
        quote = '"',
    ) {
        await this.validateGenericInput(producerSlug, exportDate);
        const fileContent = fs.readFileSync(file);
        const parsedQuote = quote === "false" ? false : quote;
        const { entities, errors } = ScdlGrantParser.parseCsv(fileContent, delimiter, parsedQuote);
        await Promise.all([this.persistEntities(entities, producerSlug), this.exportErrors(errors, file)]);
        return await dataLogService.addLog(producerSlug, file, exportDate ? new Date(exportDate) : undefined);
    }

    private async validateGenericInput(producerSlug: string, exportDateStr?: string) {
        if (exportDateStr) validateDate(exportDateStr);
        if (!(await scdlService.getProducer(producerSlug)))
            throw new Error("Producer ID does not match any producer in database");
    }

    private async persistEntities(entities: ScdlStorableGrant[], producerSlug: string) {
        if (!entities) throw new Error("No entities could be created from this file");

        console.log(`start persisting ${entities.length} grants`);
        let duplicates: MiscScdlGrantEntity[] = [];

        try {
            console.log("creates many grants...", scdlService.createManyGrants);
            await scdlService.createManyGrants(entities, producerSlug);
        } catch (e) {
            console.log("error....", e);
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
        // THOUGHTS: what do we want to do with lastUpdate ? Code was making possible to update it with a date lower than a previous one
        // e.g if we import a file from 2018 with already 2024 data the lastUpdate will be 2018
        // => always use new Date() in updateProducer
        // but if we do that lastUpdate doesn't mean the most recent data date but only the "lastUpdate" stricto sensus
        await scdlService.updateProducer(producerSlug, { lastUpdate: new Date() });
        console.log("Parsing ended successfully !");
    }

    private async exportErrors(errors: ParsedDataWithProblem[], file: string) {
        if (!DEV) return;

        const fileName = path.basename(file);
        if (!fs.existsSync(ScdlCli.errorsFolderName)) fs.mkdirSync(ScdlCli.errorsFolderName);
        const outputPath = path.join(ScdlCli.errorsFolderName, fileName + "-errors.csv");

        const csvContent = csvSyncStringifier.stringify(errors, { header: true });

        try {
            fs.writeFileSync(outputPath, csvContent, { flag: "w", encoding: "utf-8" });
        } catch (err) {
            if (err) console.log("Can't write to file");
            else console.log("fields with errors exported in " + path.resolve(outputPath));
        }
    }
}
