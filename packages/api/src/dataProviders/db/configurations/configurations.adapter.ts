import { WithId } from "mongodb";
import MongoPort from "../../../shared/MongoPort";
import ConfigurationEntity from "../../../modules/configurations/entities/ConfigurationEntity";
import { removeMongoId } from "../../../shared/mappers/mongo-document.mapper";
import { ConfigurationsPort } from "./configurations.port";

export class ConfigurationsAdapter extends MongoPort<ConfigurationEntity> implements ConfigurationsPort {
    readonly collectionName = "configurations";

    async upsert(name: string, partialEntity: Partial<ConfigurationEntity>): Promise<void> {
        await this.collection.updateOne(
            {
                name: name,
            },
            { $set: { ...partialEntity, updatedAt: new Date() } },
            { upsert: true },
        );
    }

    async getByName<T>(name: string): Promise<ConfigurationEntity<T> | null> {
        const result = (await this.collection.findOne({ name })) as WithId<ConfigurationEntity<T>> | null;
        if (!result) return null;
        return removeMongoId(result);
    }

    async createIndexes() {
        await this.collection.createIndex({ name: 1 });
    }
}

const configurationsAdapter = new ConfigurationsAdapter();

export default configurationsAdapter;
