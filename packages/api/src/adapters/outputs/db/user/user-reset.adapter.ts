import { ObjectId } from "mongodb";
import UserReset from "../../../../modules/user/entities/UserReset";
import MongoAdapter from "../MongoAdapter";
import { UserResetPort } from "./user-reset.port";
import { UserResetEntity } from "../../../../modules/user/entities/UserResetEntity";

export class UserResetAdapter extends MongoAdapter<UserReset> implements UserResetPort {
    collectionName = "users-reset";

    private defaultOptions = { projection: { _id: 0 } };

    //@TODO: put this in UserResetEntity
    private toEntity = (dbo: UserReset) => ({ ...dbo, userId: dbo.userId.toString() }) as UserResetEntity;
    private toDbo = (entity: UserResetEntity) => ({ ...entity, userId: new ObjectId(entity.userId) }) as UserReset;

    public async findByToken(token: string) {
        const userReset = await this.collection.findOne({ token }, this.defaultOptions);
        if (!userReset) return userReset;
        return this.toEntity(userReset);
    }

    // @TODO: make UserReset unique by user
    public async findByUserId(userId: ObjectId | string) {
        const userResets = await this.collection.find({ userId: new ObjectId(userId) }, this.defaultOptions).toArray();
        const test = userResets.map(userReset => this.toEntity(userReset));
        return test;
    }

    public async findOneByUserId(userId: ObjectId | string) {
        const userReset = await this.collection.findOne({ userId: new ObjectId(userId) }, this.defaultOptions);
        if (!userReset) return userReset;
        return this.toEntity(userReset);
    }

    public async create(reset: UserResetEntity) {
        await this.collection.insertOne(this.toDbo(reset));
        return reset;
    }

    public async remove(reset: UserResetEntity): Promise<void> {
        await this.collection.deleteOne({ token: reset.token });
    }

    public async removeAllByUserId(userId: string): Promise<boolean> {
        const result = await this.collection.deleteMany({ userId: new ObjectId(userId) });
        return result.acknowledged;
    }

    async createIndexes() {
        await this.collection.createIndex({ token: 1 }, { unique: true });
        await this.collection.createIndex({ userId: 1 }, { unique: true });
    }
}

const userResetAdapter = new UserResetAdapter();

export default userResetAdapter;
