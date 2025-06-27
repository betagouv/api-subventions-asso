import fs from "fs";
import path from "path";
import csvSyncStringifier from "csv-stringify/sync";
import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import scdlService from "../../modules/providers/scdl/scdl.service";
import MiscScdlGrantEntity from "../../modules/providers/scdl/entities/MiscScdlGrantEntity";
import { ScdlStorableGrant } from "../../modules/providers/scdl/@types/ScdlStorableGrant";
import Siret from "../../identifierObjects/Siret";
import {
    MixedParsedError,
    ParsedErrorDuplicate,
    ParsedErrorFormat,
} from "../../modules/providers/scdl/@types/Validation";
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
        const fileContent = fs.readFileSync(file);

        const parsedRowOffset = typeof rowOffset === "number" ? rowOffset : parseInt(rowOffset);
        const { entities, errors } = scdlService.parseXls(fileContent, pageName, parsedRowOffset);

        // persist data
        await this.persist(producerSlug, entities);
        // execute end of import methods
        await this.end({ file, producerSlug, exportDate, errors });
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
        const { entities, errors } = scdlService.parseCsv(fileContent, delimiter, parsedQuote);
        // persist data
        await this.persist(producerSlug, entities);
        // execute end of import methods
        await this.end({ file, producerSlug, exportDate, errors });
    }

    /**
     * All shared methods to execute at the end of an import (shared between CSV and XLSX imports)
     *
     * @param params All required parameters to execute end of import methods
     */
    private async end(params: {
        file: string;
        errors: MixedParsedError[];
        producerSlug: string;
        exportDate: string | undefined;
    }) {
        const { file, errors, producerSlug, exportDate } = params;
        await Promise.all([
            this.exportErrors(errors, file),
            dataLogService.addLog(producerSlug, file, exportDate ? new Date(exportDate) : undefined),
        ]);
    }

    /**
     *
     * Contains the logic to persist scdl grants entities. This is shard between CSV and XLSX process
     * Handle validation, persistence in DB, backups
     *
     * @param producerSlug (string) : Slug of the file producer
     * @param entities Entities to persist
     */
    private async persist(producerSlug: string, entities: ScdlStorableGrant[]) {
        if (!entities || !entities.length) {
            throw new Error("Importation failed : no entities could be created from this file");
        }

        const firstImport = await scdlService.isProducerFirstImport(producerSlug);

        if (!firstImport) {
            const exercises: Set<number> = entities.reduce((acc, entity) => {
                return acc.add(entity.exercice);
            }, new Set<number>());

            if (exercises.size === 0) {
                throw new Error("You must provide an exercise to clean producer's data before import");
            }

            const exercisesArray = [...exercises]; // transform Set to Array
            const documentsInDB = await scdlService.getGrantsOnPeriodBySlug(producerSlug, exercisesArray);

            await scdlService.validateImportCoverage(producerSlug, exercisesArray, entities, documentsInDB);
            await scdlService.cleanExercises(producerSlug, exercisesArray);
        }

        try {
            await this.persistEntities(entities, producerSlug);
            if (!firstImport) await scdlService.dropBackup();
        } catch (e) {
            if (!firstImport) {
                console.log("Importation failed, restoring previous exercise data");
                await scdlService.restoreBackup(producerSlug);
            }
            throw e;
        }
    }

    private async validateGenericInput(producerSlug: string, exportDateStr?: string) {
        if (exportDateStr) validateDate(exportDateStr);
        if (!(await scdlService.getProducer(producerSlug)))
            throw new Error("Producer ID does not match any producer in database");
    }

    private async persistEntities(storables: ScdlStorableGrant[], producerSlug: string) {
        if (!storables || !storables.length) throw new Error("No entities could be created from this file");

        console.log(`start persisting ${storables.length} grants`);
        let duplicates: MiscScdlGrantEntity[] = [];

        try {
            const dbos = await scdlService.buildDbosFromStorables(storables, producerSlug);
            await scdlService.saveDbos(dbos);
        } catch (e) {
            if (!(e instanceof DuplicateIndexError)) throw e;
            duplicates = (e as DuplicateIndexError<MiscScdlGrantEntity[]>).duplicates;
        }

        if (duplicates.length) {
            console.log(`${duplicates.length} duplicated entries.`);
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

    private async exportErrors(errors: (ParsedErrorDuplicate | ParsedErrorFormat)[], file: string) {
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
