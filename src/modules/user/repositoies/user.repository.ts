import db from "../../../shared/MongoConnection";
import User, { UserWithoutSecret } from "../entities/User";
import { UserUpdateError } from "./errors/UserUpdateError";

export enum UserRepositoryErrors {
    UPDATE_FAIL = 1
}

export class UserRepository {
    private readonly collection = db.collection<User>("users");

    async findByEmail(email: string) {
        return this.removeSecrets(await this.collection.findOne({email: email}));
    }

    async update(user: User | UserWithoutSecret): Promise<UserWithoutSecret> {
        const result = await this.collection.findOneAndUpdate({email: user.email}, { $set:user });

        if (!result.ok || !result.value) {
            throw new UserUpdateError()
        }
        return this.removeSecrets({...result.value, ...user }) as UserWithoutSecret;
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
        const user = await this.collection.findOne({email: userWithoutSecret.email});

        return user ? user.jwt : null;
    }

    private removeSecrets(user: User | null ): UserWithoutSecret | null {
        if (!user) return null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashPassword, jwt, ...userWithoutSecret } = user;
        return userWithoutSecret
    }
}

const userRepository = new UserRepository();

export default userRepository;