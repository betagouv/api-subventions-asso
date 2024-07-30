import MongoRepository from "../../../shared/MongoRepository";
import { DataLogEntity } from "../entities/dataLogEntity";

class DataLogRepository extends MongoRepository<DataLogEntity> {
    readonly collectionName = "data-log";

    async createIndexes() {
        await this.collection.createIndex({ providerId: 1 });
        await this.collection.createIndex({ editionDate: 1 });
        await this.collection.createIndex({ integrationDate: 1 });
    }

    async insert(entity: DataLogEntity) {
        return this.collection.insertOne(entity);
    }

    async findAll() {
        return this.collection.find({}).toArray();
    }
}

const dataLogRepository = new DataLogRepository();
export default dataLogRepository;
