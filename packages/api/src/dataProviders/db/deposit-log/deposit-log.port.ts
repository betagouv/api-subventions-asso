import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/entities/depositScdlLog.entity";

export interface DepositLogPort {
    createIndexes(): Promise<void>;

    insertOne(entity: DepositScdlLogEntity): Promise<string>;
    findOneByUserId(userId: string): Promise<DepositScdlLogEntity | null>;
    findAllFromFullDay(date: Date): Promise<DepositScdlLogEntity[] | null>;
    findFromPeriod(start: Date, end: Date): Promise<DepositScdlLogEntity[] | null>;
    deleteByUserId(userId: string): Promise<boolean>;
    updatePartial(data: Partial<DepositScdlLogEntity>): Promise<DepositScdlLogEntity>;
    findAll(): Promise<DepositScdlLogEntity[]>;
}
