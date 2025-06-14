import { getMD5 } from "../../../shared/helpers/StringHelper";
import miscScdlGrantPort from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";
import miscScdlProducersPort from "../../../dataProviders/db/providers/scdl/miscScdlProducers.port";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";
import ScdlGrantParser from "./scdl.grant.parser";
import { GenericAdapter } from "../../../shared/GenericAdapter";
import { MixedParsedError, ParsedErrorDuplicate, ParsedErrorFormat } from "./@types/Validation";

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

    async createManyGrants(grants: ScdlStorableGrant[], producerSlug: string) {
        if (!producerSlug || typeof producerSlug !== "string")
            throw new Error("Could not save SCDL grants without a producer slug");

        const producer = await this.getProducer(producerSlug);

        if (!producer) throw new Error("Provider does not exists");

        // should not happen but who knows
        if (!producer.name) throw new Error("Could not retrieve producer name");

        const dboArray = grants.map(grant => {
            return {
                ...grant,
                producerSlug: producer.slug,
                allocatorName: grant.allocatorName || producer.name,
                allocatorSiret: grant.allocatorSiret || producer.siret,
                _id: this._buildGrantUniqueId(grant, producerSlug),
            } as ScdlGrantDbo;
        });

        return miscScdlGrantPort.createMany(dboArray);
    }

    updateProducer(slug, setObject) {
        return miscScdlProducersPort.update(slug, setObject);
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

    /**
     *
     * @param slug Producer slug
     * @param entities Entities parsed from the current import
     * @returns {
     *              exercise: Last exercise number from the import
     *              enableBackup: Boolean indicating if a backup should be created before importing entities
     *          }
     * @throws Error if the import has less exercises than the existing ones in the database
     */
    async validateAndGetLastExercise(slug: string, importedEntities: ScdlStorableGrant[]) {
        const exercises: Set<number> = importedEntities.reduce((acc, entity) => {
            return acc.add(entity.exercice);
        }, new Set<number>());

        if (exercises.size === 0) {
            throw new Error("You must provide an exercise to clean producer's data before import");
        }

        const exercisesArray = [...exercises]; // transform Set to Array
        const documentsInDB = await miscScdlGrantPort.findBySlugOnPeriod(slug, exercisesArray);

        console.log(`There are currently ${documentsInDB.length} documents for producer ${slug}`);
        console.log(`The new import contains ${importedEntities.length} entities`);

        exercisesArray.forEach(exercise => {
            if (
                documentsInDB.filter(doc => doc.exercice === exercise).length >
                importedEntities.filter(entity => entity.exercice === exercise).length
            ) {
                throw new Error(
                    `You are trying to import less grants for exercise ${exercise} than what already exist in the database for producer ${slug}.`,
                );
            }
        });

        const mostRecentExercise = exercisesArray.sort((a, b) => a - b).at(-1) as number;

        return {
            exercise: mostRecentExercise,
            enableBackup: !!documentsInDB.find(doc => doc.exercice === mostRecentExercise),
        };
    }

    /**
     * Deletes given documents for a given producer slug
     * This method is used to clean the producer's data before importing new grants.
     * We don't have a unique id for the SCDL grant format, so we must delete all grants (for a given producer - and exercise : see validateAndGetLastExercise) before reimporting new - aggregated - data
     *
     * @param producerSlug Producer slug
     * @param documents List of ScdlGrantDbo to delete from the collection
     */
    async cleanExercise(producerSlug: string, exercise: number) {
        console.log("Creating backup for producer's data before importation");
        // backup producer data in case of bulk delete failure
        await miscScdlGrantPort.createBackupCollection(producerSlug);

        try {
            console.log("Deleting previously imported exercise data");
            await miscScdlGrantPort.bulkFindDelete(producerSlug, exercise);
        } catch (e) {
            console.log(`SCDL importation failed: ${(e as Error).message}`);
            console.log("Reimporting entities that might have been deleted during the importation process");
            // merge the backup collection back to the main collection
            await miscScdlGrantPort.applyBackupCollection(producerSlug);
        }
    }

    async dropBackup() {
        console.log("Droping backup collection");
        return miscScdlGrantPort.dropBackupCollection();
    }

    async restoreBackup(producerSlug: string) {
        console.log(`Restoring data from backup (for the producer " ${producerSlug})"`);
        return miscScdlGrantPort.applyBackupCollection(producerSlug);
    }
}

const scdlService = new ScdlService();
export default scdlService;
