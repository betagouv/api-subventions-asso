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

    async insertMany(entities: DataLogEntity[]) {
        return this.collection.insertMany(entities);
    }

    async findAll() {
        return this.collection.find({}).toArray();
    }

    findLastByProvider(): Promise<DataLogEntity[]> {
        return this.collection
            .aggregate([
                {
                    $group: {
                        _id: "$providerId",
                        lastIntegrationDate: { $max: "$integrationDate" },
                        lastEditionDate: { $max: "$editionDate" },
                    },
                },
                {
                    $project: {
                        providerId: "$_id",
                        integrationDate: "$lastIntegrationDate",
                        editionDate: "$lastEditionDate",
                    },
                },
            ])
            .toArray() as unknown as Promise<DataLogEntity[]>;
    }
}

const dataLogRepository = new DataLogRepository();
export default dataLogRepository;
