import { WithId } from "mongodb";
import MongoRepository from "../../../shared/MongoRepository";
import ConfigurationEntity from "../../../modules/configurations/entities/ConfigurationEntity";

export class ConfigurationsPort extends MongoRepository<ConfigurationEntity> {
    readonly collectionName = "configurations";

    async upsert(name: string, partialEntity: Partial<ConfigurationEntity>) {
        return this.collection.updateOne(
            {
                name: name,
            },
            { $set: { ...partialEntity, updatedAt: new Date() } },
            { upsert: true },
        );
    }

    getByName<T>(name: string) {
        return this.collection.findOne({ name }) as Promise<WithId<ConfigurationEntity<T>> | null>;
    }

    async createIndexes() {
        await this.collection.createIndex({ name: 1 });
    }
}

const configurationsPort = new ConfigurationsPort();

export default configurationsPort;
