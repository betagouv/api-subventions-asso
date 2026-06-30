import { WinstonLog } from "../../../../@types/WinstonLog";
import UserEntity from "../../../../domain/users/UserEntity";

export interface logsPort {
    createIndexes(): Promise<void>;

    findByEmail(email: string): Promise<WinstonLog[]>;
    getLogsOnPeriod(start: Date, end: Date): AsyncIterable<WinstonLog>;
    anonymizeLogsByUser(initialUser: UserEntity, disabledUser: UserEntity): Promise<boolean>;
    getConsumption(userIds: string[]): Promise<
        {
            userId: string;
            year: string;
            month: string;
            routes: Record<string, string[]>;
        }[]
    >;
}
