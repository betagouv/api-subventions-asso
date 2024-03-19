import MongoRepository from "../../../../shared/MongoRepository";
import MiscScdlProducerEntity from "../entities/MiscScdlProducerEntity";

export class MiscScdlProducersRepository extends MongoRepository<MiscScdlProducerEntity> {
    readonly collectionName = "misc-scdl-producers";
    readonly joinIndexes = {
        miscScdlGrant: "id",
    };

    public async findById(id: string) {
        return this.collection.findOne({ id });
    }

    public async create(entity: MiscScdlProducerEntity) {
        return this.collection.insertOne(entity);
    }

    public async update(id: string, set: Partial<MiscScdlProducerEntity>) {
        return this.collection.updateOne({ id }, { $set: set });
    }

    async createIndexes() {
        await this.collection.createIndex({ id: 1 }, { unique: true });
        await this.collection.createIndex({ name: 1 }, { unique: true });
    }
}

const miscScdlProducersRepository = new MiscScdlProducersRepository();

export default miscScdlProducersRepository;
