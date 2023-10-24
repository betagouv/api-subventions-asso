import { WithId } from "mongodb";
import MigrationRepository from "../../../shared/MigrationRepository";
import ConfigurationEntity from "../entities/ConfigurationEntity";

export class ConfigurationsRepository extends MigrationRepository<ConfigurationEntity> {
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
        await this.collection.createIndex({ name: 1 }, { unique: true });
    }
}

const configurationsRepository = new ConfigurationsRepository();

export default configurationsRepository;
