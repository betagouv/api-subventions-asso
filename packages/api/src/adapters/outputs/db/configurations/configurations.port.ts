import ConfigurationEntity from "../../../../modules/configurations/entities/ConfigurationEntity";

export interface ConfigurationsPort {
    createIndexes(): Promise<void>;

    upsert(name: string, partialEntity: Partial<ConfigurationEntity>): Promise<void>;
    getByName<T>(name: string): Promise<ConfigurationEntity<T> | null>;
}
