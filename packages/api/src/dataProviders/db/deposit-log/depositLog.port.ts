import MongoPort from "../../../shared/MongoPort";
import DepositLogMapper from "./deposit-log.mapper";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/entities/depositScdlLog.entity";
import DepositScdlLogDbo from "./DepositScdlLogDbo";
import { NotFoundError } from "core";
import { Filter, FindOptions } from "mongodb";

class DepositLogPort extends MongoPort<DepositScdlLogDbo> {
    collectionName = "deposit-log";

    async createIndexes() {
        await this.collection.createIndex({ userId: 1 }, { unique: true });
    }

    public insertOne(entity: DepositScdlLogEntity) {
        return this.collection.insertOne(DepositLogMapper.toDbo(entity));
    }

    async findOneByUserId(userId: string): Promise<DepositScdlLogEntity | null> {
        const depositLogDbo = await this.collection.findOne({ userId });
        if (!depositLogDbo) return null;
        return DepositLogMapper.dboToEntity(depositLogDbo);
    }

    /**
     * Returns all deposits from a 24h range since given date
     *
     * @param date start date of the 24h range
     * @returns
     */
    async findAllFromFullDay(date: Date): Promise<DepositScdlLogEntity[] | null> {
        const greaterThan = new Date(date);
        greaterThan.setUTCHours(0, 0, 0, 0);
        const lowerThan = new Date(greaterThan);
        lowerThan.setDate(lowerThan.getDate() + 1);
        const dbos = await this.collection.find({ updateDate: { $gte: greaterThan, $lt: lowerThan } }).toArray();
        return dbos.map(dbo => DepositLogMapper.dboToEntity(dbo));
    }

    async deleteByUserId(userId: string) {
        const result = await this.collection.deleteOne({ userId });
        return result.deletedCount > 0;
    }

    async updatePartial(data: Partial<DepositScdlLogEntity>): Promise<DepositScdlLogEntity> {
        const { step, userId, ...toUpdate } = data;

        const depositLogDbo = await this.collection.findOneAndUpdate(
            { userId: userId },
            { $set: { ...toUpdate, updateDate: new Date() }, $max: { step: step } },
            { returnDocument: "after" },
        );

        if (!depositLogDbo) {
            throw new NotFoundError("Deposit log not found");
        }
        return DepositLogMapper.dboToEntity(depositLogDbo);
    }

    async find(query: Filter<DepositScdlLogDbo> = {}, options?: FindOptions): Promise<DepositScdlLogEntity[]> {
        const dbos = await this.collection.find(query, options).toArray();
        return dbos.map(dbo => DepositLogMapper.dboToEntity(dbo));
    }
}

const depositLogPort = new DepositLogPort();

export default depositLogPort;
