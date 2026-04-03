import { WinstonLog } from "../../../../@types/WinstonLog";
import { UserDto } from "dto";

export interface logsPort {
    createIndexes(): Promise<void>;

    findByEmail(email: string): Promise<WinstonLog[]>;
    getLogsOnPeriod(start: Date, end: Date): AsyncIterable<WinstonLog>;
    anonymizeLogsByUser(initialUser: UserDto, disabledUser: UserDto): Promise<boolean>;
    getConsumption(userIds: string[]): Promise<
        {
            userId: string;
            year: string;
            month: string;
            routes: Record<string, string[]>;
        }[]
    >;
}
