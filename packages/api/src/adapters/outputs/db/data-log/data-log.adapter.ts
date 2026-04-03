import MongoAdapter from "../MongoAdapter";
import { DataLogEntity } from "../../../../modules/data-log/entities/dataLogEntity";
import { ProducerLogEntity } from "../../../../modules/data-log/entities/producerLogEntity";
import { removeMongoId, removeMongoIds } from "../mongo-document.mapper";
import { DataLogPort } from "./data-log.port";

class DataLogAdapter extends MongoAdapter<DataLogEntity> implements DataLogPort {
    readonly collectionName = "data-log";

    async createIndexes(): Promise<void> {
        await this.collection.createIndex({ providerId: 1 });
        await this.collection.createIndex({ editionDate: 1 });
        await this.collection.createIndex({ integrationDate: 1 });
    }

    async insert(entity: DataLogEntity): Promise<void> {
        await this.collection.insertOne(entity);
    }

    async insertMany(entities: DataLogEntity[]): Promise<void> {
        await this.collection.insertMany(entities);
    }

    async findAll(): Promise<DataLogEntity[]> {
        const result = await this.collection.find().toArray();
        return removeMongoIds(result);
    }

    findAllCursor(): AsyncIterable<DataLogEntity> {
        const cursor = this.collection.find({});
        return cursor.map(removeMongoId);
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
