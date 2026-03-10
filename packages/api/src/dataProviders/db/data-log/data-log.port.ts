import { DataLogEntity } from "../../../modules/data-log/entities/dataLogEntity";
import { ProducerLogEntity } from "../../../modules/data-log/entities/producerLogEntity";

export interface DataLogPort {
    createIndexes(): Promise<void>;

    insert(entity: DataLogEntity): Promise<string>;
    insertMany(entities: DataLogEntity[]): Promise<string[] | undefined>;
    findAll(): Promise<DataLogEntity[]>;
    findAllCursor(): AsyncIterable<DataLogEntity>;
    getLastImportByProvider(providerId: string): Promise<Date>;
    getProvidersLogOverview(): Promise<ProducerLogEntity[]>;
}
