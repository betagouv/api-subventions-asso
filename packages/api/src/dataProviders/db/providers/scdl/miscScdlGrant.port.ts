import MongoPort from "../../../../shared/MongoPort";
import MiscScdlGrantEntity from "../../../../modules/providers/scdl/entities/MiscScdlGrantEntity";
import { buildDuplicateIndexError, isMongoDuplicateError } from "../../../../shared/helpers/MongoHelper";
import { ScdlGrantDbo } from "../../../../modules/providers/scdl/dbo/ScdlGrantDbo";

export class MiscScdlGrantPort extends MongoPort<ScdlGrantDbo> {
    readonly collectionName = "misc-scdl-grant";
    readonly backupCollectionName = this.collectionName + "-backup";
    readonly joinIndexes = {
        miscScdlProducer: "producerSlug",
    };

    public findOneBySlug(slug: string) {
        return this.collection.findOne({ producerSlug: slug });
    }

    public async findAll() {
        return this.collection.find({}).toArray();
    }

    // retrieves documents over a period of exercise
    public async findBySlugOnPeriod(slug: string, exercises: number[]): Promise<MiscScdlGrantEntity[]> {
        if (exercises.length == 1)
            return await this.collection
                .find({ producerSlug: slug, exercice: exercises[0] }, { projection: { _id: 0 } })
                .toArray();
        else
            return this.collection
                .find({ producerSlug: slug, exercice: { $in: exercises } }, { projection: { _id: 0 } })
                .toArray();
    }

    public async createMany(entities: ScdlGrantDbo[]) {
        return this.collection.insertMany(entities, { ordered: false }).catch(error => {
            if (isMongoDuplicateError(error)) {
                throw buildDuplicateIndexError<MiscScdlGrantEntity[]>(error);
            }
        });
    }

    // we use bulk instead of deleteMany as $in might cause performance issues with large arrays
    public async bulkFindDeleteByExercices(slug: string, exercises: number[]) {
        const bulk = this.collection.initializeUnorderedBulkOp();
        exercises.forEach(exercise => {
            bulk.find({ producerSlug: slug, exercice: exercise }).delete();
        });
        return bulk.execute().catch(error => {
            throw error;
        });
    }

    /**
     * Save all given producer data in a backup collection
     * @param slug Producer slug
     */
    public createBackupCollection(slug: string) {
        console.log(`creating backup for producer ${slug} in collection ${this.backupCollectionName}`);
        return this.collection
            .aggregate([{ $match: { producerSlug: slug } }, { $out: this.backupCollectionName }])
            .toArray();
    }

    /**
     * Drop the backup collection
     */
    public async dropBackupCollection() {
        console.log(`Dropping backup collection ${this.backupCollectionName}`);
        return this.db.collection(this.backupCollectionName).drop();
    }

    /**
     * Apply backup collection created in createBackupCollection
     * @param slug Producer slug
     */
    public async applyBackupCollection(slug: string) {
        await this.collection.deleteMany({ producerSlug: slug });
        await this.db
            .collection(this.backupCollectionName)
            .aggregate([{ $out: this.collection }])
            .toArray();
        await this.createIndexes(); // backup seems to only copy the data, not the indexes
        await this.dropBackupCollection();
    }

    async createIndexes() {
        await this.collection.createIndex({ associationSiret: 1 });
        await this.collection.createIndex({ associationRna: 1 });
        await this.collection.createIndex({ producerSlug: 1 });
    }
}

const miscScdlGrantPort = new MiscScdlGrantPort();

export default miscScdlGrantPort;
