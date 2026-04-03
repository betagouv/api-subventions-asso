import { ObjectId } from "mongodb";
import { ConsumerToken } from "../../../../modules/user/entities/ConsumerToken";
import MongoAdapter from "../MongoAdapter";
import { ConsumerTokenPort } from "./consumer-token.port";

class ConsumerTokenAdapter extends MongoAdapter<ConsumerToken> implements ConsumerTokenPort {
    collectionName = "consumer-token";

    async findToken(userId: string | ObjectId): Promise<string | undefined> {
        return (await this.collection.findOne({ userId: new ObjectId(userId) }))?.token;
    }

    async find(userId: string): Promise<ConsumerToken[]> {
        return this.collection.find({ userId: new ObjectId(userId) }).toArray();
    }

    async create(entity: ConsumerToken): Promise<boolean> {
        return (await this.collection.insertOne(entity)).acknowledged;
    }

    async deleteAllByUserId(userId: string | ObjectId): Promise<boolean> {
        const result = await this.collection.deleteMany({ userId: new ObjectId(userId) });
        return result.acknowledged;
    }

    async createIndexes() {
        await this.collection.createIndex({ userId: 1 });
    }
}

const consumerTokenAdapter = new ConsumerTokenAdapter();

export default consumerTokenAdapter;
