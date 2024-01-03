import { MongoServerError } from "mongodb";
import MongoRepository from "../../../../shared/MongoRepository";
import MiscScdlGrantEntity from "../entities/MiscScdlGrantEntity";
import { buildDuplicateIndexError, isDuplicateError } from "../../../../shared/helpers/MongoHelper";

export class MiscScdlGrantRepository extends MongoRepository<MiscScdlGrantEntity> {
    readonly collectionName = "misc-scdl-grant";

    public async findAll() {
        return this.collection.find({}).toArray();
    }

    public async createMany(entities: MiscScdlGrantEntity[]) {
        return this.collection.insertMany(entities, { ordered: false }).catch(error => {
            if (error instanceof MongoServerError && isDuplicateError(error)) {
                throw buildDuplicateIndexError<MiscScdlGrantEntity[]>(error);
            }
        });
    }

    async createIndexes() {
        await this.collection.createIndex({ producerId: 1 });
        await this.collection.createIndex({ associationSiret: 1 });
        await this.collection.createIndex({ associationRna: 1 });
        await this.collection.createIndex(
            { producerId: 1, decisionReference: 1, conventionDate: 1, associationSiret: 1, object: 1, amount: 1 },
            {
                unique: true,
                name: "UNIQUE_ID_MISC_SCDL_GRANT",
            },
        );
    }
}

const miscScdlGrantRepository = new MiscScdlGrantRepository();

export default miscScdlGrantRepository;
