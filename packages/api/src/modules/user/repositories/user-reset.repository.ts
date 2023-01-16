import { ObjectId } from "mongodb";
import db from "../../../shared/MongoConnection";
import UserReset from "../entities/UserReset";

export class UserResetRepository {
    private readonly collection = db.collection<UserReset>("users-reset");

    public async findByToken(token: string) {
        return this.collection.findOne({ token });
    }

    public async findByUserId(userId: ObjectId) {
        return this.collection.findOne({ userId });
    }

    public async create(reset: UserReset) {
        await this.collection.insertOne(reset);
        return reset;
    }

    public async remove(reset: UserReset) {
        return this.collection.deleteOne(reset);
    }

    public async removeAllByUserId(userId: ObjectId) {
        return this.collection.deleteMany({ userId });
    }
}

const userResetRepository = new UserResetRepository();

export default userResetRepository;
