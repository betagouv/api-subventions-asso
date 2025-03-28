import { ObjectId } from "mongodb";
import MongoPort from "../../../shared/MongoPort";
import { AgentConnectTokenDbo } from "../../../modules/user/@types/AgentConnectUser";

class AgentConnectTokenPort extends MongoPort<AgentConnectTokenDbo> {
    collectionName = "agent-connect-token";

    findLastActive(userId: ObjectId) {
        return this.collection.findOne({ userId: new ObjectId(userId) }, { sort: { creationDate: -1 } });
    }

    async upsert(entity: Omit<AgentConnectTokenDbo, "_id">) {
        return (await this.collection.updateOne({ userId: entity.userId }, { $set: entity }, { upsert: true }))
            .acknowledged;
    }

    async deleteAllByUserId(userId: string | ObjectId) {
        const result = await this.collection.deleteMany({ userId: new ObjectId(userId) });
        return result.acknowledged;
    }

    async createIndexes() {
        await this.collection.createIndex({ userId: 1 }, { unique: true });
        await this.collection.createIndex({ expiresAt: 1 });
    }
}

const agentConnectTokenPort = new AgentConnectTokenPort();
export default agentConnectTokenPort;
