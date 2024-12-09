import { ObjectId } from "mongodb";
import { ConsumerToken } from "../../../modules/user/entities/ConsumerToken";
import MongoPort from "../../../shared/MongoPort";

class ConsumerTokenPort extends MongoPort<ConsumerToken> {
    collectionName = "consumer-token";

    async findToken(userId: string | ObjectId) {
        return (await this.collection.findOne({ userId: new ObjectId(userId) }))?.token;
    }

    async find(userId: string) {
        return this.collection.find({ userId: new ObjectId(userId) }).toArray();
    }

    async create(entity: ConsumerToken) {
        return (await this.collection.insertOne(entity)).acknowledged;
    }

    async deleteAllByUserId(userId: string | ObjectId) {
        const result = await this.collection.deleteMany({ userId: new ObjectId(userId) });
        return result.acknowledged;
    }

    async createIndexes() {
        await this.collection.createIndex({ userId: 1 });
    }
}

const consumerTokenPort = new ConsumerTokenPort();

export default consumerTokenPort;
