import MongoPort from "../../../shared/MongoPort";
import { DataLogEntity } from "../../../modules/data-log/entities/dataLogEntity";
import { ProducerLogEntity } from "../../../modules/data-log/entities/producerLogEntity";
import { DataLogPort } from "./data-log.port";

class DataLogAdapter extends MongoPort<DataLogEntity> implements DataLogPort {
    readonly collectionName = "data-log";

    async createIndexes() {
        await this.collection.createIndex({ providerId: 1 });
        await this.collection.createIndex({ editionDate: 1 });
        await this.collection.createIndex({ integrationDate: 1 });
    }

    async insert(entity: DataLogEntity) {
        const result = await this.collection.insertOne(entity);
        return result.insertedId.toString();
    }

    async insertMany(entities: DataLogEntity[]) {
        const result = await this.collection.insertMany(entities);
        return Object.values(result.insertedIds).map(id => id.toString());
    }

    async findAll(): Promise<DataLogEntity[]> {
        const result = await this.collection.find().toArray();
        return result.map(({ _id, ...entity }) => entity as DataLogEntity);
    }

    findAllCursor(): AsyncIterable<DataLogEntity> {
        const cursor = this.collection.find({});

        return cursor.map(({ _id, ...entity }) => entity as DataLogEntity);
    }

    async getLastImportByProvider(providerId: string): Promise<Date> {
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

const dataLogAdapter = new DataLogAdapter();

export default dataLogAdapter;
