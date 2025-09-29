import MongoPort from "../../../shared/MongoPort";
import DepositLogAdapter from "./DepositLog.adapter";
import DepositScdlLogEntity from "../../../modules/deposit-scdl-process/depositScdlLog.entity";
import DepositScdlLogDbo from "./DepositScdlLogDbo";

class DepositLogPort extends MongoPort<DepositScdlLogDbo> {
    collectionName = "deposit-log";

    async createIndexes() {
        await this.collection.createIndex({ userId: 1 }, { unique: true });
    }

    public insertOne(entity: DepositScdlLogEntity) {
        return this.collection.insertOne(DepositLogAdapter.toDbo(entity));
    }

    async findOneByUserId(userId: string): Promise<DepositScdlLogEntity | null> {
        const depositLogDbo = await this.collection.findOne({ userId });
        return DepositLogAdapter.dboToEntity(depositLogDbo);
    }

    async deleteByUserId(userId: string) {
        const result = await this.collection.deleteOne({ userId });
        return result.deletedCount > 0;
    }
}

const depositLogPort = new DepositLogPort();

export default depositLogPort;
