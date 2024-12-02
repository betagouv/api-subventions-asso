import { ObjectId } from "mongodb";
import UserReset from "../../../modules/user/entities/UserReset";
import MongoRepository from "../../../shared/MongoRepository";

export class UserResetPort extends MongoRepository<UserReset> {
    collectionName = "users-reset";

    public async findByToken(token: string) {
        return this.collection.findOne({ token });
    }

    public async findByUserId(userId: ObjectId | string) {
        return this.collection.find({ userId: new ObjectId(userId) }).toArray();
    }

    public async findOneByUserId(userId: ObjectId | string) {
        return this.collection.findOne({ userId: new ObjectId(userId) });
    }

    public async create(reset: UserReset) {
        await this.collection.insertOne(reset);
        return reset;
    }

    public async remove(reset: UserReset) {
        return this.collection.deleteOne(reset);
    }

    public async removeAllByUserId(userId: ObjectId) {
        const result = await this.collection.deleteMany({ userId });
        return result.acknowledged;
    }

    async createIndexes() {
        await this.collection.createIndex({ token: 1 }, { unique: true });
        await this.collection.createIndex({ userId: 1 }, { unique: true });
    }
}

const userResetPort = new UserResetPort();

export default userResetPort;
