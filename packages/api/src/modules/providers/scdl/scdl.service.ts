import { getMD5 } from "../../../shared/helpers/StringHelper";
import miscScdlGrantPort from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";
import miscScdlProducersPort from "../../../dataProviders/db/providers/scdl/miscScdlProducers.port";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";
import ScdlGrantParser from "./scdl.grant.parser";
import { GenericAdapter } from "../../../shared/GenericAdapter";
import { MixedParsedError, ParsedErrorDuplicate, ParsedErrorFormat } from "./@types/Validation";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";
import applicationFlatPort from "../../../dataProviders/db/applicationFlat/applicationFlat.port";
import Siret from "../../../identifierObjects/Siret";
import apiAssoService from "../apiAsso/apiAsso.service";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";
import scdlGrantService from "./scdl.grant.service";
import { DuplicateIndexError } from "../../../shared/errors/dbError/DuplicateIndexError";
import { ScdlParsedInfos } from "./@types/ScdlParsedInfos";

export class ScdlService {
    getProducer(siret: Siret) {
        return miscScdlProducersPort.findBySiret(siret.toString());
    }

    getProducers() {
        return miscScdlProducersPort.findAll();
    }

    async createProducer(siret: Siret) {
        const asso = await apiAssoService.findAssociationBySiren(siret.toSiren());
        const name: string | undefined = asso?.denomination_siren?.[0].value ?? asso?.denomination_rna?.[0].value;
        if (!name) throw new Error(`Could not find allocator name with SIRET ${siret}`);
        const producer: MiscScdlProducerEntity = { siret: siret.toString(), name };
        await miscScdlProducersPort.create(producer);
        return producer;
    }

    private _buildGrantUniqueId(grant: ScdlStorableGrant, allocatorSiret: string) {
        // allocatorSiret is supposed to be in __data__.
        // Currently, the process accept it empty while it remains defined in the entrypoint
        // The day we striclty accept SCDL format, allocatorSiret would always be defined and we could remove it from id genertation
        return getMD5(`${allocatorSiret.toString()}-${JSON.stringify(grant.__data__)}`);
    }

    async buildDbosFromStorables(grants: ScdlStorableGrant[], producer: MiscScdlProducerEntity) {
        return grants.map(grant => {
            return {
                ...grant,
                allocatorName: producer.name,
                allocatorSiret: producer.siret,
                _id: this._buildGrantUniqueId(grant, producer.siret),
            } as ScdlGrantDbo;
        });
    }

    async saveDbos(dbos: ScdlGrantDbo[]) {
        await miscScdlGrantPort.createMany(dbos);
    }

    parseXls(fileContent: Buffer, pageName?: string, rowOffset = 0) {
        const { entities, errors, parsedInfos } = ScdlGrantParser.parseExcel(fileContent, pageName, rowOffset);
        return { entities, errors: this.normalizeErrors(errors), parsedInfos };
    }

    parseCsv(fileContent: Buffer, delimiter = ";", quote: string | boolean = '"') {
        const { entities, errors, parsedInfos } = ScdlGrantParser.parseCsv(fileContent, delimiter, quote);
        return { entities, errors: this.normalizeErrors(errors), parsedInfos };
    }

    /**
     *
     * @param errors Format or duplicates errors
     * @returns Normalized errors. To be inserted in the same CSV it must share the same format
     */
    normalizeErrors(errors: (ParsedErrorDuplicate | ParsedErrorFormat)[]) {
        const normalizedErrors: MixedParsedError[] = errors.map(error => {
            if (error.message) {
                error.doublon = "non";
            }
            if (error.doublon === "oui") {
                error.colonne = GenericAdapter.NOT_APPLICABLE_VALUE;
                error.valeur = GenericAdapter.NOT_APPLICABLE_VALUE;
                error.message = GenericAdapter.NOT_APPLICABLE_VALUE;
            }
            return error as MixedParsedError;
        });
        return normalizedErrors;
    }

    async isProducerFirstImport(siret: string): Promise<boolean> {
        return !(await miscScdlGrantPort.findOneByAllocatorSiret(siret));
    }

    /**
     * Validates that the new import contain at least the same amount of data for each given exercise
     *
     * @param siret Producer SIRET
     * @param exercices List of exercises contained in the import file
     * @param importedEntities Entities parsed from the imported file
     * @param documentsInDB Entities fetched from DB concerning exercises
     *
     * @throws Error if the import has less exercises than the existing ones in the database
     */
    async validateImportCoverage(
        siret: string,
        exercices: number[],
        importedEntities: ScdlStorableGrant[],
        documentsInDB: MiscScdlGrantEntity[],
    ) {
        console.log(
            `There are currently ${documentsInDB.length} documents for allocator SIRET ${siret} in given exercice${exercices.length > 1 ? "s" : ""} ${exercices.join(" | ")}`,
        );
        console.log(`The new import contains ${importedEntities.length} entities`);

        exercices.forEach(exercise => {
            if (
                documentsInDB.filter(doc => doc.exercice === exercise).length >
                importedEntities.filter(entity => entity.exercice === exercise).length
            ) {
                throw new Error(
                    `You are trying to import less grants for exercise ${exercise} than what already exist in the database for producer's SIRET ${siret}.`,
                );
            }
        });
    }

    getGrantsOnPeriodByAllocator(allocatorSiret: string, exercices: number[]) {
        return miscScdlGrantPort.findByAllocatorOnPeriod(allocatorSiret, exercices);
    }

    /**
     * Deletes given documents for a given producer's SIRET
     * This method is used to clean the producer's data before importing new grants.
     * We don't have a unique id for the SCDL grant format, so we must delete all grants (for a given producer - and exercise : see validateAndGetLastExercise) before reimporting new - aggregated - data
     *
     * @param siret Producer siret
     * @param exercises list of exercises that will be saved and replaces
     */
    async cleanExercises(siret: string, exercises: number[]) {
        console.log("Creating backup for producer's data before importation");
        const applicationFlatProvider = `scdl-${siret}`;
        // backup producer data in case of bulk delete failure
        await miscScdlGrantPort.createBackupCollection(siret);
        await applicationFlatPort.createBackupByProvider(applicationFlatProvider);

        try {
            console.log("Deleting previously imported exercise data");
            await miscScdlGrantPort.bulkFindDeleteByExercices(siret, exercises);
            await applicationFlatPort.bulkFindDeleteByExercises(applicationFlatProvider, exercises);
        } catch (e) {
            console.log(`SCDL importation failed: ${(e as Error).message}`);
            console.log("Reimporting entities that might have been deleted during the importation process");
            // merge the backup collection back to the main collection
            await miscScdlGrantPort.applyBackupCollection(siret);
            await applicationFlatPort.applyBackupCollection(applicationFlatProvider);
        }
    }

    async dropBackup() {
        console.log("Droping backup collection");
        await miscScdlGrantPort.dropBackupCollection();
        await applicationFlatPort.dropBackupCollection();
    }

    async restoreBackup(allocatorSiret: string) {
        console.log(`Restoring data from backup (for the producer SIRET ${allocatorSiret})`);
        await miscScdlGrantPort.applyBackupCollection(allocatorSiret);
        await applicationFlatPort.applyBackupCollection(`scdl-${allocatorSiret}`);
    }

    /**
     *
     * Contains the logic to persist scdl grants entities. This is shard between CSV and XLSX process
     * Handle validation, persistence in DB, backups
     *
     * @param producer Producer to persist data for
     * @param entities Entities to persist
     */
    public async persist(producer: MiscScdlProducerEntity, entities: ScdlStorableGrant[]) {
        if (!entities || !entities.length) {
            throw new Error("Importation failed : no entities could be created from this file");
        }

        const firstImport = await this.isProducerFirstImport(producer.siret);

        if (!firstImport) {
            const exercises: Set<number> = entities.reduce((acc, entity) => {
                return acc.add(entity.exercice);
            }, new Set<number>());

            if (exercises.size === 0) {
                throw new Error("You must provide an exercise to clean producer's data before import");
            }

            const exercisesArray = [...exercises]; // transform Set to Array
            const documentsInDB = await this.getGrantsOnPeriodByAllocator(producer.siret, exercisesArray);
            await this.validateImportCoverage(producer.siret, exercisesArray, entities, documentsInDB);
            await this.cleanExercises(producer.siret, exercisesArray);
        }

        try {
            await this.persistEntities(entities, producer);
            if (!firstImport) await this.dropBackup();
        } catch (e) {
            if (!firstImport) {
                console.log("Importation failed, restoring previous exercise data");
                await this.restoreBackup(producer.siret);
            }
            throw e;
        }
    }

    public async persistEntities(storables: ScdlStorableGrant[], producer: MiscScdlProducerEntity) {
        if (!storables || !storables.length) throw new Error("No entities could be created from this file");

        console.log(`start persisting ${storables.length} grants`);
        let duplicates: MiscScdlGrantEntity[] = [];

        try {
            // the cli builds dbo because objectId from misc-scdl collection is also used in application flat
            const dbos = await this.buildDbosFromStorables(storables, producer);
            await this.saveDbos(dbos);
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

    public validateHeaders(parsedInfos: ScdlParsedInfos, filename: string): void {
        if (parsedInfos.headerValidationResult.missingOptional.length > 0) {
            console.warn(
                `Missing optional headers in file ${filename} : ${parsedInfos.headerValidationResult.missingOptional.join(", ")}`,
            );
        }
        if (parsedInfos.headerValidationResult.missingMandatory.length > 0) {
            throw new Error(
                `Missing required headers in file ${filename} : ${parsedInfos.headerValidationResult.missingMandatory.join(", ")}`,
            );
        }
    }
}

const scdlService = new ScdlService();
export default scdlService;
