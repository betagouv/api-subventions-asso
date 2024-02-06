import MongoRepository from "../../../../shared/MongoRepository";
import MiscScdlGrantEntity from "../entities/MiscScdlGrantEntity";
import { buildDuplicateIndexError, isMongoDuplicateError } from "../../../../shared/helpers/MongoHelper";
import { ScdlGrantDbo } from "../dbo/ScdlGrantDbo";

export class MiscScdlGrantRepository extends MongoRepository<ScdlGrantDbo> {
    readonly collectionName = "misc-scdl-grant";
    readonly joinIndexes = {
        miscScdlProducer: "producerId",
    };

    public async findAll() {
        return this.collection.find({}).toArray();
    }

    public async createMany(entities: ScdlGrantDbo[]) {
        return this.collection.insertMany(entities, { ordered: false }).catch(error => {
            if (isMongoDuplicateError(error)) {
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
