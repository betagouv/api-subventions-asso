import MongoAdapter from "../../MongoAdapter";
import MiscScdlGrantEntity from "../../../../modules/providers/scdl/entities/MiscScdlGrantEntity";
import { buildDuplicateIndexError, isMongoDuplicateError } from "../../../../shared/helpers/MongoHelper";
import { ScdlGrantDbo } from "../../../../modules/providers/scdl/dbo/ScdlGrantDbo";
import { MiscScdlGrantPort } from "./misc-scdl-grant.port";

export class MiscScdlGrantAdapter extends MongoAdapter<ScdlGrantDbo> implements MiscScdlGrantPort {
    readonly collectionName = "misc-scdl-grant";
    readonly backupCollectionName = this.collectionName + "-backup";

    readonly joinIndexes = {
        miscScdlProducer: "allocatorSiret",
    };

    public findOneByAllocatorSiret(siret: string): Promise<MiscScdlGrantEntity | null> {
        return this.collection.findOne({ allocatorSiret: siret });
    }

    public async findAll(): Promise<MiscScdlGrantEntity[]> {
        return this.collection.find({}).toArray();
    }

    public findAllCursor() {
        return this.collection.find({});
    }

    public getPaginate(skip: number, limit: 1000) {
        return this.collection.find({}).skip(skip).limit(limit);
    }

    // retrieves documents over a period of exercise
    public async findByAllocatorOnPeriod(siret: string, exercises: number[]): Promise<MiscScdlGrantEntity[]> {
        if (exercises.length == 1)
            return await this.collection
                .find({ allocatorSiret: siret, exercice: exercises[0] }, { projection: { _id: 0 } })
                .toArray();
        else
            return this.collection
                .find({ allocatorSiret: siret, exercice: { $in: exercises } }, { projection: { _id: 0 } })
                .toArray();
    }

    public async createMany(dbos: ScdlGrantDbo[]): Promise<void> {
        // the port takes dbo directly because objectId from misc-scdl collection is also used in application flat
        await this.collection.insertMany(dbos, { ordered: false }).catch(error => {
            if (isMongoDuplicateError(error)) {
                throw buildDuplicateIndexError<MiscScdlGrantEntity[]>(error);
            }
        });
    }

    // we use bulk instead of deleteMany as $in might cause performance issues with large arrays
    public async bulkFindDeleteByExercices(allocatorSiret: string, exercises: number[]): Promise<void> {
        const bulk = this.collection.initializeUnorderedBulkOp();
        exercises.forEach(exercise => {
            const query: Partial<ScdlGrantDbo> = { allocatorSiret, exercice: exercise };
            bulk.find(query).delete();
        });
        await bulk.execute().catch(error => {
            throw error;
        });
    }

    /**
     * Save all given producer data in a backup collection
     * @param allocatorSiret Allocator SIRET
     */
    public async createBackupCollection(allocatorSiret: string): Promise<void> {
        console.log(`creating backup for allocator SIRET ${allocatorSiret} in collection ${this.backupCollectionName}`);
        await this.collection
            .aggregate([{ $match: { allocatorSiret } }, { $out: this.backupCollectionName }])
            .toArray();
    }

    /**
     * Drop the backup collection
     */
    public async dropBackupCollection(): Promise<void> {
        console.log(`Dropping backup collection ${this.backupCollectionName}`);
        await this.db.collection(this.backupCollectionName).drop();
    }

    /**
     * Apply backup collection created in createBackupCollection
     * @param siret Allocator SIRET
     */
    public async applyBackupCollection(_allocatorSiret: string): Promise<void> {
        throw new Error("backup is disabled, please clean data manually for now");
        // await this.collection.deleteMany({ allocatorSiret: _allocatorSiret });
        // await this.db
        //     .collection(this.backupCollectionName)
        //     .aggregate([{ $out: this.collection }])
        //     .toArray();
        // await this.createIndexes(); // backup seems to only copy the data, not the indexes
        // await this.dropBackupCollection();
    }

    async createIndexes() {
        await this.collection.createIndex({ associationSiret: 1 });
        await this.collection.createIndex({ associationRna: 1 });
    }
}

const miscScdlGrantAdapter = new MiscScdlGrantAdapter();

export default miscScdlGrantAdapter;
