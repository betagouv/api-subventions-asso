import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/entities/depositScdlLog.entity";
import { InsertResult } from "../../../shared/@types/repository.types";

export interface DepositLogPort {
    createIndexes(): Promise<void>;

    insertOne(entity: DepositScdlLogEntity): Promise<InsertResult<string>>;
    findOneByUserId(userId: string): Promise<DepositScdlLogEntity | null>;
    findAllFromFullDay(date: Date): Promise<DepositScdlLogEntity[] | null>;
    deleteByUserId(userId: string): Promise<boolean>;
    updatePartial(data: Partial<DepositScdlLogEntity>): Promise<DepositScdlLogEntity>;
    findAll(): Promise<DepositScdlLogEntity[]>;
}
