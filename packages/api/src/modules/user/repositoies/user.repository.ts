import { Filter, ObjectId, WithId } from "mongodb";
import db from "../../../shared/MongoConnection";
import User, { UserWithoutSecret } from "../entities/User";

export enum UserRepositoryErrors {
    UPDATE_FAIL = 1
}

export class UserRepository {
    private readonly collection = db.collection<User>("users");

    async findByEmail(email: string) {
        return this.removeSecrets(await this.collection.findOne({email: email}));
    }

    async find(query: Filter<User> = {}) {
        const dbos = await this.collection.find(query).toArray();
        return dbos.map(dbo => this.removeSecrets(dbo));
    }

    async findById(userId: ObjectId) {
        return this.removeSecrets(await this.collection.findOne({_id: userId}));
    }

    async update(user: User | UserWithoutSecret): Promise<UserWithoutSecret> {
        if (user._id) await this.collection.updateOne({_id: user._id}, { $set:user });
        else await this.collection.updateOne({email: user.email}, { $set:user });

        return this.findByEmail(user.email) as unknown as UserWithoutSecret;
    }

    async delete(user:UserWithoutSecret): Promise<boolean> {
        const result = await this.collection.deleteOne({ _id: user._id});
        return result.acknowledged;
    }

    async create(user: User) {
        const result = await this.collection.insertOne(user);
        return this.removeSecrets(await this.collection.findOne({_id: result.insertedId}));
    }

    async findPassword(userWithoutSecret: UserWithoutSecret) {
        const user = await this.collection.findOne({email: userWithoutSecret.email});

        return user ? user.hashPassword : null;
    }

    async findJwt(userWithoutSecret: UserWithoutSecret) {
        const user = await this.collection.findOne({_id: userWithoutSecret._id});

        return user ? user.jwt : null;
    }

    private removeSecrets(user: WithId<User> | null ): WithId<UserWithoutSecret> | null {
        if (!user) return null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashPassword, jwt, ...userWithoutSecret } = user;
        return userWithoutSecret
    }
}

const userRepository = new UserRepository();

export default userRepository;