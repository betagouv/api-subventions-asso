import db from "../../../shared/MongoConnection";
import { ConsumerToken } from "../entities/ConsumerToken";

class ConsumerTokenRepository {
    private readonly collection = db.collection<ConsumerToken>("consumer-token");

    async findToken(userId) {
        return (await this.collection.findOne({ userId }))?.token
    }

    async create(entity: ConsumerToken) {
        return (await this.collection.insertOne(entity)).acknowledged;
    }
}

const consumerTokenRepository = new ConsumerTokenRepository();

export default consumerTokenRepository;
