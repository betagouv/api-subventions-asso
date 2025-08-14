import MongoPort from "../../../shared/MongoPort";
import { DataLogEntity } from "../../../modules/data-log/entities/dataLogEntity";
import { ProducerLogEntity } from "../../../modules/data-log/entities/producerLogEntity";

class DataLogPort extends MongoPort<DataLogEntity> {
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

    async getLastImportByProvider(providerId: string) {
        return (
            await this.collection
                .aggregate([
                    {
                        $match: {
                            providerId,
                        },
                    },
                    {
                        $sort: { integrationDate: -1 },
                    },
                    { $limit: 1 },
                ])
                .toArray()
        )[0].integrationDate;
    }

    getProvidersLogOverview(): Promise<ProducerLogEntity[]> {
        return this.collection
            .aggregate([
                {
                    $group: {
                        _id: "$providerId",
                        lastIntegrationDate: { $max: "$integrationDate" },
                        firstIntegrationDate: { $min: "$integrationDate" },
                        lastEditionDate: { $max: "$editionDate" },
                    },
                },
                {
                    $project: {
                        providerId: "$_id",
                        lastIntegrationDate: "$lastIntegrationDate",
                        firstIntegrationDate: "$firstIntegrationDate",
                        editionDate: "$lastEditionDate",
                    },
                },
            ])
            .toArray() as unknown as Promise<ProducerLogEntity[]>;
    }
}

const dataLogPort = new DataLogPort();
export default dataLogPort;
