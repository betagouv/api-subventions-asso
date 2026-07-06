import { Filter, FindOptions, ObjectId, WithId } from "mongodb";
import MongoAdapter from "../MongoAdapter";
import { UserPort } from "./user.port";
import { UserDbo } from "./user.dbo";
import UserEntity from "../../../../domain/users/UserEntity";
import UserMapper from "./user.mapper";
import NewUserEntity from "../../../../domain/users/NewUserEntity";
import { UserNotFoundError } from "core";

export class UserAdapter extends MongoAdapter<UserDbo> implements UserPort {
    collectionName = "users";

    joinIndexes = {
        associationVisits: "_id",
    };

    private safeProjection = { hashPassword: 0, jwt: 0 };
    private defaultProjection = { hashPassword: 0 };

    async findAll() {
        return (await this.collection.find({}).toArray()).map(dbo => UserMapper.toEntity(dbo));
    }

    async findByEmail(email: string) {
        const user = (await this.collection.findOne({ email: email }, { projection: this.safeProjection })) as WithId<
            Omit<UserDbo, "hashPassword" | "jwt">
        >;
        if (!user) throw new UserNotFoundError();
        return UserMapper.toEntity(user);
    }

    async find(query: Filter<UserDbo> = {}, options?: FindOptions) {
        if (!options) options = { projection: this.safeProjection };
        const dbos = await this.collection.find(query, options).toArray();
        return dbos.map(dbo => UserMapper.toEntity(dbo));
    }

    async findByIds(ids: string[]) {
        const objectIds = ids.map(id => new ObjectId(id));
        return (
            await this.collection
                .find({ _id: { $in: objectIds } }, { projection: { jwt: 0, hashPassword: 0 } })
                .toArray()
        ).map(dbo => UserMapper.toEntity(dbo));
    }

    async findById(userId: ObjectId | string) {
        const user = (await this.collection.findOne(
            { _id: new ObjectId(userId) },
            { projection: this.safeProjection },
        )) as WithId<Omit<UserDbo, "hashPassword" | "jwt">>;
        if (!user) return null;
        return UserMapper.toEntity(user);
    }

    async findByPeriod(begin: Date, end: Date, withAdmin) {
        const query: Filter<UserDbo> = { signupAt: { $gte: begin, $lt: end } };
        if (!withAdmin) query.roles = { $ne: "admin" };
        return this.find(query);
    }

    // @TODO: move this out of adapters as it contains application logic
    async findInactiveSince(date: Date) {
        const query: Filter<UserDbo> = {
            lastActivityDate: { $lt: date },
            roles: { $ne: "admin" },
            disable: { $ne: true },
        };
        return this.find(query);
    }

    // @TODO: move this out of adapters as it contains application logic
    async findNotActivatedSince(date: Date, lastWarned: Date | undefined = undefined) {
        const query: Filter<UserDbo> = {
            active: false,
            signupAt: lastWarned ? { $lt: date, $gt: lastWarned } : { $lt: date },
            roles: { $ne: "admin" },
            disable: { $ne: true },
        };
        return this.find(query);
    }

    async update(user: UserEntity, withJwt = false) {
        const projection = withJwt ? { projection: this.defaultProjection } : { projection: this.safeProjection };
        const updatedUser = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(user.id) },
            { $set: user },
            {
                ignoreUndefined: true, // protect from jwt erasing
                returnDocument: "after",
                ...projection, // projection = { projection: { hashPassword: 0, jwt: 0 }}
            },
        );

        if (!updatedUser) throw new UserNotFoundError();
        return UserMapper.toEntity(updatedUser);
    }

    async removeJwt(userId: string) {
        const updatedUser = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $unset: { jwt: "" } },
            {
                returnDocument: "after",
                projection: this.safeProjection,
            },
        );

        if (!updatedUser) throw new UserNotFoundError();
        return UserMapper.toEntity(updatedUser);
    }

    async delete(user: UserEntity) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(user.id) });
        return result.acknowledged;
    }

    async create(user: NewUserEntity) {
        const objectId = new ObjectId();
        await this.collection.insertOne({ _id: objectId, ...user });
        return new UserEntity({ ...user, id: objectId.toString() });
    }

    async getUserWithSecretsByEmail(email: string) {
        const user = await this.collection.findOne({ email });
        if (!user) return null;
        return UserMapper.toEntity(user);
    }

    async getUserWithSecretsById(id: string) {
        const user = await this.collection.findOne({ _id: new ObjectId(id) });
        if (!user) return null;
        return UserMapper.toEntity(user);
    }

    countTotalUsersOnDate(date, withAdmin: boolean): Promise<number> {
        const query: Filter<UserDbo> = { signupAt: { $lt: date } };
        if (!withAdmin) query.roles = { $ne: "admin" };
        return this.collection.find(query).count();
    }

    async createIndexes(): Promise<void> {
        await this.collection.createIndex({ email: 1 }, { unique: true });
    }

    async updateNbRequests(countByUser: { count: number; _id: string }[]): Promise<void> {
        const bulk = countByUser.map(({ _id, count }) => ({
            updateOne: {
                filter: { _id: new ObjectId(_id) },
                update: { $inc: { nbVisits: count } },
            },
        }));
        if (!bulk.length) return;
        await this.db.collection("users").bulkWrite(bulk);
    }
}

const userAdapter = new UserAdapter();

export default userAdapter;
