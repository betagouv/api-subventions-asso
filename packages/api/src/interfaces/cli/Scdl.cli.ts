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
import { detectAndEncode, validateDate } from "../../shared/helpers/CliHelper";
import scdlGrantService from "../../modules/providers/scdl/scdl.grant.service";
import applicationFlatService from "../../modules/applicationFlat/applicationFlat.service";
import MiscScdlProducerEntity from "../../modules/providers/scdl/entities/MiscScdlProducerEntity";
import notifyService from "../../modules/notify/notify.service";
import { NotificationType } from "../../modules/notify/@types/NotificationType";

export default class ScdlCli {
    static cmdName = "scdl";

    // relative path refers to package's root
    static errorsFolderName = "./import-errors";

    public async addProducer(siretStr: string) {
        const siret = new Siret(siretStr);
        if (await scdlService.getProducer(siret)) throw new Error("Producer already exists");
        await scdlService.createProducer(siret);
    }

    public async parseXls(
        filePath: string,
        allocatorSiret: string,
        exportDate: string | undefined = undefined,
        pageName: string | undefined = undefined,
        rowOffset: number | string = 0,
    ) {
        const siret = new Siret(allocatorSiret);
        const producer = await scdlService.getProducer(siret);
        console.log("parseXls producer : ", producer);
        await this.validateGenericInput(producer, exportDate);
        const fileContent = detectAndEncode(filePath);

        const parsedRowOffset = typeof rowOffset === "number" ? rowOffset : parseInt(rowOffset);
        const { entities, errors } = scdlService.parseXls(fileContent, pageName, parsedRowOffset);

        // persist data
        await this.persist(producer as MiscScdlProducerEntity, entities);
        // execute end of import methods
        await this.end({ file: filePath, producer: producer as MiscScdlProducerEntity, exportDate, errors });
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
        filePath: string,
        allocatorSiret: string,
        exportDate: string | undefined = undefined,
        delimiter = ";",
        quote = '"',
    ) {
        const siret = new Siret(allocatorSiret);
        const producer = await scdlService.getProducer(siret);
        await this.validateGenericInput(producer, exportDate);
        const fileContent = detectAndEncode(filePath);

        const parsedQuote = quote === "false" ? false : quote;
        const { entities, errors } = scdlService.parseCsv(fileContent, delimiter, parsedQuote);
        // persist data
        await this.persist(producer as MiscScdlProducerEntity, entities);
        // execute end of import methods
        await this.end({ file: filePath, producer: producer as MiscScdlProducerEntity, exportDate, errors });
    }

    /**
     * All shared methods to execute at the end of an import (shared between CSV and XLSX imports)
     *
     * @param params All required parameters to execute end of import methods
     */
    private async end(params: {
        file: string;
        errors: MixedParsedError[];
        producer: MiscScdlProducerEntity;
        exportDate: string | undefined;
    }) {
        const { file, errors, producer, exportDate: dateStr } = params;
        const exportDate = dateStr ? new Date(dateStr) : undefined;
        notifyService.notify(NotificationType.DATA_IMPORT_SUCCESS, {
            providerName: producer.name,
            providerSiret: producer.siret,
            exportDate,
        });
        await Promise.all([this.exportErrors(errors, file), dataLogService.addLog(producer.slug, file, exportDate)]);
    }

    /**
     *
     * Contains the logic to persist scdl grants entities. This is shard between CSV and XLSX process
     * Handle validation, persistence in DB, backups
     *
     * @param producerSlug (string) : Slug of the file producer
     * @param entities Entities to persist
     */
    private async persist(producer: MiscScdlProducerEntity, entities: ScdlStorableGrant[]) {
        if (!entities || !entities.length) {
            throw new Error("Importation failed : no entities could be created from this file");
        }

        const firstImport = await scdlService.isProducerFirstImport(producer.slug);

        if (!firstImport) {
            const exercises: Set<number> = entities.reduce((acc, entity) => {
                return acc.add(entity.exercice);
            }, new Set<number>());

            if (exercises.size === 0) {
                throw new Error("You must provide an exercise to clean producer's data before import");
            }

            const exercisesArray = [...exercises]; // transform Set to Array
            const documentsInDB = await scdlService.getGrantsOnPeriodByAllocator(producer.siret, exercisesArray);
            await scdlService.validateImportCoverage(producer.slug, exercisesArray, entities, documentsInDB);
            await scdlService.cleanExercises(producer.slug, exercisesArray);
        }

        try {
            await this.persistEntities(entities, producer);
            if (!firstImport) await scdlService.dropBackup();
        } catch (e) {
            if (!firstImport) {
                console.log("Importation failed, restoring previous exercise data");
                await scdlService.restoreBackup(producer.slug);
            }
            throw e;
        }
    }

    private async validateGenericInput(producer: MiscScdlProducerEntity | null, exportDateStr?: string) {
        if (exportDateStr) validateDate(exportDateStr);
        if (!producer) throw new Error("Producer does not match any producer in database");
    }

    private async persistEntities(storables: ScdlStorableGrant[], producer: MiscScdlProducerEntity) {
        if (!storables || !storables.length) throw new Error("No entities could be created from this file");

        console.log(`start persisting ${storables.length} grants`);
        let duplicates: MiscScdlGrantEntity[] = [];

        try {
            // the cli builds dbo because objectId from misc-scdl collection is also used in application flat
            const dbos = await scdlService.buildDbosFromStorables(storables, producer);
            await scdlService.saveDbos(dbos);
            await scdlGrantService.saveDbosToApplicationFlat(dbos);
        } catch (e) {
            if (!(e instanceof DuplicateIndexError)) throw e;
            duplicates = (e as DuplicateIndexError<MiscScdlGrantEntity[]>).duplicates;
        }

        if (duplicates.length) {
            console.log(`${duplicates.length} duplicated entries.`);
        } else {
            console.log(`No duplicates detected`);
        }

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

    async initApplicationFlat() {
        if (await applicationFlatService.containsDataFromProvider(/^scdl-/))
            return console.warn(
                "DB already initialized, maybe you want to manually empty collection before running this command",
            );
        const ticTacInterval = setInterval(() => console.log("TIC"), 60000);
        console.log("Create application flat entities from scdl collection");
        try {
            await scdlGrantService.initApplicationFlat();
        } finally {
            clearInterval(ticTacInterval);
        }
    }
}
