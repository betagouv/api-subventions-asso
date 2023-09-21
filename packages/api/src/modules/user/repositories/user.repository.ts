import { UserDto } from "dto";
import { Filter, ObjectId } from "mongodb";
import db from "../../../shared/MongoConnection";
import { removeSecrets } from "../../../shared/helpers/RepositoryHelper";
import { InternalServerError } from "../../../shared/errors/httpErrors";
import UserDbo, { UserNotPersisted } from "./dbo/UserDbo";

export class UserRepository {
    collectionName = "users";
    private readonly collection = db.collection<UserDbo>("users");

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

    async update(user: Partial<UserDbo>): Promise<UserDbo> {
        const res = user._id
            ? await this.collection.findOneAndUpdate({ _id: user._id }, { $set: user }, { returnDocument: "after" })
            : await this.collection.findOneAndUpdate(
                  { email: user.email },
                  { $set: user },
                  { returnDocument: "after" },
              );
        if (!res.value) throw new InternalServerError("User update failed");
        return res.value;
    }

    async delete(user: UserDto): Promise<boolean> {
        const result = await this.collection.deleteOne({ _id: user._id });
        return result.acknowledged;
    }

    async create(user: UserNotPersisted): Promise<UserDto> {
        const userDbo = { ...user, _id: new ObjectId() };
        const result = await this.collection.insertOne(userDbo);
        return removeSecrets({ ...user, _id: result.insertedId });
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
}

const userRepository = new UserRepository();

export default userRepository;
