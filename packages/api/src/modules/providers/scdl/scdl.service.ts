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

export class ScdlService {
    producerNames: string[] = [];

    async init() {
        this.producerNames = (await this.getProducers()).map(producer => producer.name);
    }

    getProducer(siret: Siret) {
        return miscScdlProducersPort.findBySiret(siret.toString());
    }

    getProducers() {
        return miscScdlProducersPort.findAll();
    }

    getSlugFromName(name: string) {
        return name
            .normalize("NFD") // used to decompose "combined graphemes". cf : https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
            .replaceAll(/[\u0300-\u036f]/g, "") // removes accents
            .replaceAll(/(\s|'|_)/g, "-") // replaces whitespaces, underscores and quotes  with hyphens
            .toLowerCase();
    }

    async createProducer(siret: Siret) {
        const asso = await apiAssoService.findAssociationBySiren(siret.toSiren());
        const name: string | undefined = asso?.denomination_siren?.[0].value ?? asso?.denomination_rna?.[0].value;
        if (!name) throw new Error(`Could not find allocator name with SIRET ${siret}`);
        const slug = this.getSlugFromName(name);
        const producer: MiscScdlProducerEntity = { siret: siret.toString(), slug, name };
        await miscScdlProducersPort.create(producer);
        this.producerNames.push(name);
        return producer;
    }

    private _buildGrantUniqueId(grant: ScdlStorableGrant, producerSlug: string) {
        return getMD5(`${producerSlug}-${JSON.stringify(grant.__data__)}`);
    }

    async buildDbosFromStorables(grants: ScdlStorableGrant[], producer: MiscScdlProducerEntity) {
        return grants.map(grant => {
            return {
                ...grant,
                producerSlug: producer.slug,
                allocatorName: producer.name,
                allocatorSiret: producer.siret,
                _id: this._buildGrantUniqueId(grant, producer.slug),
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

    async isProducerFirstImport(slug: string): Promise<boolean> {
        return !(await miscScdlGrantPort.findOneBySlug(slug));
    }

    /**
     * Validates that the new import contain at least the same amount of data for each given exercise
     *
     * @param slug Producer slug
     * @param exercices List of exercises contained in the import file
     * @param importedEntities Entities parsed from the imported file
     * @param documentsInDB Entities fetched from DB concerning exercises
     *
     * @throws Error if the import has less exercises than the existing ones in the database
     */
    async validateImportCoverage(
        slug: string,
        exercices: number[],
        importedEntities: ScdlStorableGrant[],
        documentsInDB: MiscScdlGrantEntity[],
    ) {
        console.log(
            `There are currently ${documentsInDB.length} documents for producer ${slug} in given exercice${exercices.length > 1 ? "s" : ""} ${exercices.join(" | ")}`,
        );
        console.log(`The new import contains ${importedEntities.length} entities`);

        exercices.forEach(exercise => {
            if (
                documentsInDB.filter(doc => doc.exercice === exercise).length >
                importedEntities.filter(entity => entity.exercice === exercise).length
            ) {
                throw new Error(
                    `You are trying to import less grants for exercise ${exercise} than what already exist in the database for producer ${slug}.`,
                );
            }
        });
    }

    getGrantsOnPeriodByAllocator(allocatorSiret: string, exercices: number[]) {
        return miscScdlGrantPort.findByAllocatorOnPeriod(allocatorSiret, exercices);
    }

    /**
     * Deletes given documents for a given producer slug
     * This method is used to clean the producer's data before importing new grants.
     * We don't have a unique id for the SCDL grant format, so we must delete all grants (for a given producer - and exercise : see validateAndGetLastExercise) before reimporting new - aggregated - data
     *
     * @param producerSlug Producer slug
     * @param exercises list of exercises that will be saved and replaces
     */
    async cleanExercises(producerSlug: string, exercises: number[]) {
        console.log("Creating backup for producer's data before importation");
        const applicationFlatProvider = `scdl-${producerSlug}`;
        // backup producer data in case of bulk delete failure
        await miscScdlGrantPort.createBackupCollection(producerSlug);
        await applicationFlatPort.createBackupByProvider(applicationFlatProvider);

        try {
            console.log("Deleting previously imported exercise data");
            await applicationFlatPort.bulkFindDeleteByExercises(applicationFlatProvider, exercises);
            await miscScdlGrantPort.bulkFindDeleteByExercices(producerSlug, exercises);
        } catch (e) {
            console.log(`SCDL importation failed: ${(e as Error).message}`);
            console.log("Reimporting entities that might have been deleted during the importation process");
            // merge the backup collection back to the main collection
            await miscScdlGrantPort.applyBackupCollection(producerSlug);
            await applicationFlatPort.applyBackupCollection(applicationFlatProvider);
        }
    }

    async dropBackup() {
        console.log("Droping backup collection");
        await miscScdlGrantPort.dropBackupCollection();
        await applicationFlatPort.dropBackupCollection();
    }

    async restoreBackup(producerSlug: string) {
        console.log(`Restoring data from backup (for the producer " ${producerSlug})"`);
        await miscScdlGrantPort.applyBackupCollection(producerSlug);
        await applicationFlatPort.applyBackupCollection(`scdl-${producerSlug}`);
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

        const firstImport = await this.isProducerFirstImport(producer.slug);

        if (!firstImport) {
            const exercises: Set<number> = entities.reduce((acc, entity) => {
                return acc.add(entity.exercice);
            }, new Set<number>());

            if (exercises.size === 0) {
                throw new Error("You must provide an exercise to clean producer's data before import");
            }

            const exercisesArray = [...exercises]; // transform Set to Array
            const documentsInDB = await this.getGrantsOnPeriodByAllocator(producer.siret, exercisesArray);
            await this.validateImportCoverage(producer.slug, exercisesArray, entities, documentsInDB);
            await this.cleanExercises(producer.slug, exercisesArray);
        }

        try {
            await this.persistEntities(entities, producer);
            if (!firstImport) await this.dropBackup();
        } catch (e) {
            if (!firstImport) {
                console.log("Importation failed, restoring previous exercise data");
                await this.restoreBackup(producer.slug);
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
}

const scdlService = new ScdlService();
export default scdlService;
