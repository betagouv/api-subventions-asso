import { ObjectId } from "mongodb";
import db from "../../../shared/MongoConnection";
import { ConsumerToken } from "../entities/ConsumerToken";

class ConsumerTokenRepository {
    private readonly collection = db.collection<ConsumerToken>("consumer-token");

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

const consumerTokenRepository = new ConsumerTokenRepository();

export default consumerTokenRepository;
