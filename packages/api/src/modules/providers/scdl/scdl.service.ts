import { getMD5 } from "../../../shared/helpers/StringHelper";
import miscScdlGrantPort from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";
import miscScdlProducersPort from "../../../dataProviders/db/providers/scdl/miscScdlProducers.port";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";
import ScdlGrantParser from "./scdl.grant.parser";
import { GenericAdapter } from "../../../shared/GenericAdapter";
import { MixedParsedError, ParsedErrorDuplicate, ParsedErrorFormat } from "./@types/Validation";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";
import applicationFlatPort from "../../../dataProviders/db/applicationFlat/applicationFlat.port";

export class ScdlService {
    producerNames: string[] = [];

    async init() {
        this.producerNames = (await this.getProducers()).map(producer => producer.name);
    }

    getProducer(slug: string) {
        return miscScdlProducersPort.findBySlug(slug);
    }

    getProducers() {
        return miscScdlProducersPort.findAll();
    }

    async createProducer(entity: MiscScdlProducerEntity) {
        await miscScdlProducersPort.create(entity);
        this.producerNames.push(entity.name);
    }

    private _buildGrantUniqueId(grant: ScdlStorableGrant, producerSlug: string) {
        return getMD5(`${producerSlug}-${JSON.stringify(grant.__data__)}`);
    }

    async buildDbosFromStorables(grants: ScdlStorableGrant[], producerSlug: string) {
        if (!producerSlug || typeof producerSlug !== "string")
            throw new Error("Could not save SCDL grants without a producer slug");

        const producer = await this.getProducer(producerSlug);

        if (!producer) throw new Error("Provider does not exists");

        // should not happen but who knows
        if (!producer.name) throw new Error("Could not retrieve producer name");

        return grants.map(grant => {
            return {
                ...grant,
                producerSlug: producer.slug,
                allocatorName: grant.allocatorName || producer.name,
                allocatorSiret: grant.allocatorSiret || producer.siret,
                _id: this._buildGrantUniqueId(grant, producerSlug),
            } as ScdlGrantDbo;
        });
    }

    async saveDbos(dbos: ScdlGrantDbo[]) {
        await miscScdlGrantPort.createMany(dbos);
    }

    parseXls(fileContent: Buffer, pageName?: string, rowOffset = 0) {
        const { entities, errors } = ScdlGrantParser.parseExcel(fileContent, pageName, rowOffset);
        return { entities, errors: this.normalizeErrors(errors) };
    }

    parseCsv(fileContent: Buffer, delimiter = ";", quote: string | boolean = '"') {
        const { entities, errors } = ScdlGrantParser.parseCsv(fileContent, delimiter, quote);
        return { entities, errors: this.normalizeErrors(errors) };
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
     * @param docuemtnsInDB Entities fetched from DB concerning exercises
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

    getGrantsOnPeriodBySlug(producerSlug: string, exercices: number[]) {
        return miscScdlGrantPort.findBySlugOnPeriod(producerSlug, exercices);
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
}

const scdlService = new ScdlService();
export default scdlService;
