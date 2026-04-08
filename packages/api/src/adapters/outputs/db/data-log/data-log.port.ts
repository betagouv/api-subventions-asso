import { DataLogEntity, UserFileDataLogEntity } from "../../../../modules/data-log/entities/dataLogEntity";
import { ProducerLogEntity } from "../../../../modules/data-log/entities/producerLogEntity";

export interface DataLogPort {
    createIndexes(): Promise<void>;

    insert(entity: DataLogEntity): Promise<void>;
    insertMany(entities: DataLogEntity[]): Promise<void>;
    findAll(): Promise<DataLogEntity[]>;
    findAllCursor(): AsyncIterable<DataLogEntity>;
    getLastImportByProvider(providerId: string): Promise<Date>;
    getProvidersLogOverview(): Promise<ProducerLogEntity[]>;
    findUserFileLogsFromPeriod(start: Date, end: Date): Promise<UserFileDataLogEntity[] | null>;
}
