import MongoAdapter from "../MongoAdapter";
import DepositScdlLogDbo from "./DepositScdlLogDbo";
import { DepositLogPort } from "./deposit-log.port";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/entities/depositScdlLog.entity";
import DepositLogMapper from "./deposit-log.mapper";
import { NotFoundError } from "core";

class DepositLogAdapter extends MongoAdapter<DepositScdlLogDbo> implements DepositLogPort {
    collectionName = "deposit-log";

    async createIndexes() {
        await this.collection.createIndex({ userId: 1 }, { unique: true });
    }

    public async insertOne(entity: DepositScdlLogEntity): Promise<void> {
        const dbo = DepositLogMapper.toDbo(entity);
        await this.collection.insertOne(dbo);
    }

    async findOneByUserId(userId: string): Promise<DepositScdlLogEntity | null> {
        const depositLogDbo = await this.collection.findOne({ userId });
        if (!depositLogDbo) return null;
        return DepositLogMapper.dboToEntity(depositLogDbo);
    }

    // @TODO: flat hours process isn't relevant as user only deposit during work time
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

    async findFromPeriod(start: Date, end: Date) {
        const dbos = await this.collection.find({ updateDate: { $gte: start, $lte: end } }).toArray();
        return dbos.map(dbo => DepositLogMapper.dboToEntity(dbo));
    }

    async deleteByUserId(userId: string): Promise<boolean> {
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

    async findAll(): Promise<DepositScdlLogEntity[]> {
        const dbos = await this.collection.find().toArray();
        return dbos.map(dbo => DepositLogMapper.dboToEntity(dbo));
    }
}

const depositLogAdapter = new DepositLogAdapter();

export default depositLogAdapter;
