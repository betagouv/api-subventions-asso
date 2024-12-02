import MongoRepository from "../../../../shared/MongoRepository";
import MiscScdlGrantEntity from "../../../../modules/providers/scdl/entities/MiscScdlGrantEntity";
import { buildDuplicateIndexError, isMongoDuplicateError } from "../../../../shared/helpers/MongoHelper";
import { ScdlGrantDbo } from "../../../../modules/providers/scdl/dbo/ScdlGrantDbo";

export class MiscScdlGrantPort extends MongoRepository<ScdlGrantDbo> {
    readonly collectionName = "misc-scdl-grant";
    readonly joinIndexes = {
        miscScdlProducer: "producerSlug",
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
        await this.collection.createIndex({ associationSiret: 1 });
        await this.collection.createIndex({ associationRna: 1 });
        await this.collection.createIndex({ producerSlug: 1 });
    }
}

const miscScdlGrantPort = new MiscScdlGrantPort();

export default miscScdlGrantPort;
