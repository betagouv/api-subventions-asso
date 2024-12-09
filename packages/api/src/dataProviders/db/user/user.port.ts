import { UserDto } from "dto";
import { Filter, ObjectId } from "mongodb";
import { buildDuplicateIndexError, isMongoDuplicateError } from "../../../shared/helpers/MongoHelper";
import MongoPort from "../../../shared/MongoPort";
import { removeHashPassword, removeSecrets } from "../../../shared/helpers/PortHelper";
import { InternalServerError } from "../../../shared/errors/httpErrors";
import UserDbo, { UserNotPersisted } from "./UserDbo";

export class UserPort extends MongoPort<UserDbo> {
    collectionName = "users";

    joinIndexes = {
        associationVisits: "_id",
    };

    async findAll() {
        return this.collection.find({}).toArray();
    }

    async findByEmail(email: string) {
        const user = await this.collection.findOne({ email: email });
        if (!user) return null;
        return removeSecrets(user);
    }

    async find(query: Filter<UserDbo> = {}): Promise<UserDto[]> {
        const dbos = await this.collection.find(query).toArray();
        return dbos.map(dbo => removeSecrets(dbo));
    }

    async findById(userId: ObjectId | string): Promise<UserDto | null> {
        const user = await this.collection.findOne({ _id: new ObjectId(userId) });
        if (!user) return null;
        return removeSecrets(user);
    }

    async findByPeriod(begin: Date, end: Date, withAdmin): Promise<UserDto[]> {
        const query: Filter<UserDbo> = { signupAt: { $gte: begin, $lt: end } };
        if (!withAdmin) query.roles = { $ne: "admin" };
        return this.find(query);
    }

    async findInactiveSince(date: Date): Promise<UserDto[]> {
        const query: Filter<UserDbo> = {
            lastActivityDate: { $lt: date },
            roles: { $ne: "admin" },
            disable: { $ne: true },
        };
        return this.find(query);
    }

    async findNotActivatedSince(date: Date, lastWarned: Date | undefined = undefined): Promise<UserDto[]> {
        const query: Filter<UserDbo> = {
            lastActivityDate: null,
            signupAt: { $lt: date },
            roles: { $ne: "admin" },
            disable: { $ne: true },
        };
        // @ts-expect-error -- query too strictly typed
        if (lastWarned) query.signupAt["$gt"] = lastWarned;
        return this.find(query);
    }

    async update(user: Partial<UserDbo>, withJwt = false): Promise<UserDto | Omit<UserDbo, "hashPassword">> {
        const res = user._id
            ? await this.collection.findOneAndUpdate({ _id: user._id }, { $set: user }, { returnDocument: "after" })
            : await this.collection.findOneAndUpdate(
                  { email: user.email },
                  { $set: user },
                  { returnDocument: "after" },
              );

        if (!res) throw new InternalServerError("User update failed");
        return withJwt ? removeHashPassword(res) : removeSecrets(res);
    }

    async delete(user: UserDto): Promise<boolean> {
        const result = await this.collection.deleteOne({ _id: user._id });
        return result.acknowledged;
    }

    async create(user: UserNotPersisted): Promise<UserDto> {
        return removeSecrets(await this.createAndReturnWithJWT(user));
    }

    async createAndReturnWithJWT(user: UserNotPersisted): Promise<Omit<UserDbo, "hashPassword">> {
        const userDbo: UserDbo = { ...user, _id: new ObjectId() };

        try {
            await this.collection.insertOne(userDbo);
        } catch (error) {
            if (isMongoDuplicateError(error)) throw buildDuplicateIndexError<UserDbo>(error);
            throw error;
        }
        return removeHashPassword(userDbo);
    }

    async getUserWithSecretsByEmail(email: string): Promise<UserDbo | null> {
        return this.collection.findOne({ email });
    }

    async getUserWithSecretsById(id: ObjectId): Promise<UserDbo | null> {
        return this.collection.findOne({ _id: id });
    }

    countTotalUsersOnDate(date, withAdmin: boolean) {
        const query: Filter<UserDbo> = { signupAt: { $lt: date } };
        if (!withAdmin) query.roles = { $ne: "admin" };
        return this.collection.find(query).count();
    }

    async createIndexes() {
        await this.collection.createIndex({ email: 1 }, { unique: true });
    }
}

const userPort = new UserPort();

export default userPort;
