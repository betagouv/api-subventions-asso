import UserDto from "@api-subventions-asso/dto/user/UserDto";
import { Filter, ObjectId } from "mongodb";
import db from "../../../shared/MongoConnection";
import User from "../entities/UserNotPersisted";
import UserDbo from "./dbo/UserDbo";
import { firstDayOfPeriod, getMonthlyDataObject, nextDayAfterPeriod } from "../../../shared/helpers/DateHelper";

export enum UserRepositoryErrors {
    UPDATE_FAIL = 1
}

export class UserRepository {
    private readonly collection = db.collection<UserDbo>("users");

    async findByEmail(email: string) {
        const user = await this.collection.findOne({ email: email });
        if (!user) return null;
        return this.removeSecrets(user);
    }

    async find(query: Filter<User> = {}) {
        const dbos = await this.collection.find(query).toArray();
        return dbos.map(dbo => this.removeSecrets(dbo));
    }

    async findById(userId: ObjectId | string) {
        const user = await this.collection.findOne({ _id: new ObjectId(userId) });
        if (!user) return null;
        return this.removeSecrets(user);
    }

    async update(user: UserDbo | UserDto): Promise<UserDto> {
        if (user._id) await this.collection.updateOne({ _id: user._id }, { $set: user });
        else await this.collection.updateOne({ email: user.email }, { $set: user });
        return user;
    }

    async delete(user: UserDto): Promise<boolean> {
        const result = await this.collection.deleteOne({ _id: user._id });
        return result.acknowledged;
    }

    async create(user: User) {
        const userDbo = { ...user, _id: new ObjectId() };
        const result = await this.collection.insertOne(userDbo);
        return this.removeSecrets({ ...user, _id: result.insertedId });
    }

    async getUserWithSecretsByEmail(email: string): Promise<UserDbo | null> {
        return this.collection.findOne({ email });
    }

    async getUserWithSecretsById(id: ObjectId): Promise<UserDbo | null> {
        return this.collection.findOne({ _id: id });
    }

    private removeSecrets(user: UserDbo): UserDto | null {
        if (!user) return null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashPassword, jwt, ...userWithoutSecret } = user;
        return userWithoutSecret;
    }

    async getMonthlyNbByYear(year: number) {
        const pipeline = [
            { $match: { roles: ["user"], signupAt: { $lt: nextDayAfterPeriod(year) } } },
            { $project: { signupAt: 1 } },
            {
                $group: {
                    _id: { $dateTrunc: { date: "$signupAt", unit: "month" } },
                    nbNewUsers: { $count: {} }
                }
            },
            {
                $densify: {
                    field: "_id",
                    range: { step: 1, unit: "month", bounds: [firstDayOfPeriod(year), nextDayAfterPeriod(year)] }
                }
            },
            {
                $setWindowFields: {
                    sortBy: { _id: 1 },
                    output: {
                        cumulativeNbUsers: {
                            $sum: "$nbNewUsers",
                            window: { documents: ["unbounded", "current"] }
                        }
                    }
                }
            },
            { $match: { _id: { $gte: firstDayOfPeriod(year) } } },
            { $project: { monthId: { $month: "$_id" }, cumulativeNbUsers: 1 } }
        ];
        const queryResult = await this.collection
            .aggregate<{ _id: ObjectId; monthId: number; cumulativeNbUsers: number }>(pipeline)
            .toArray();
        return getMonthlyDataObject(queryResult, "monthId", "cumulativeNbUsers");
    }
}

const userRepository = new UserRepository();

export default userRepository;
