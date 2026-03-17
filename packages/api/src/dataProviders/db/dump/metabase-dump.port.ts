import { DataLogEntity } from "../../../modules/data-log/entities/dataLogEntity";

export interface MetabaseDumpPort {
    connectToDumpDatabase(): Promise<void>;
    addLogs(logs: unknown[]): Promise<void>;
    addVisits(visits: unknown[]): Promise<void>;
    upsertUsers(users: unknown[]): Promise<void>;
    patchWithPipedriveData(): Promise<void>;
    savePipedrive(users: unknown): Promise<void>;
    cleanAfterDate(date: Date): Promise<void>;
    upsertDepositLogs(depositLogs: unknown[]): Promise<void>;
    upsertDataLog(dataLogs: AsyncIterable<DataLogEntity>): Promise<void>;
}
