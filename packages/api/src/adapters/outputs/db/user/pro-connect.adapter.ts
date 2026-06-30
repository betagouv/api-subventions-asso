import { ObjectId } from "mongodb";
import MongoAdapter from "../MongoAdapter";
import { ProConnectTokenDbo } from "../../../../modules/user/@types/ProConnectUser";
import ProConnectTokenPort from "./pro-connect-token.port";

class ProConnectTokenAdapter extends MongoAdapter<ProConnectTokenDbo> implements ProConnectTokenPort {
    collectionName = "pro-connect-token";

    findLastActive(userId: string): Promise<ProConnectTokenDbo | null> {
        return this.collection.findOne({ userId: new ObjectId(userId) }, { sort: { creationDate: -1 } });
    }

    async upsert(entity: Omit<ProConnectTokenDbo, "_id" | "userId"> & { userId: string }): Promise<boolean> {
        const { userId, ...partialDbo } = entity;
        const objectId = new ObjectId(userId);

        return (
            await this.collection.updateOne(
                { userId: objectId },
                { $set: { ...partialDbo, _id: objectId } },
                { upsert: true },
            )
        ).acknowledged;
    }

    async deleteAllByUserId(userId: string | ObjectId): Promise<boolean> {
        const result = await this.collection.deleteMany({ userId: new ObjectId(userId) });
        return result.acknowledged;
    }

    async createIndexes(): Promise<void> {
        await this.collection.createIndex({ userId: 1 }, { unique: true });
        await this.collection.createIndex({ expiresAt: 1 });
    }
}

const proConnectTokenAdapter = new ProConnectTokenAdapter();
export default proConnectTokenAdapter;
