import { UserDto } from "dto";
import { Filter, FindOptions, ObjectId } from "mongodb";
import { InternalServerError } from "core";
import { buildDuplicateIndexError, isMongoDuplicateError } from "../../../shared/helpers/MongoHelper";
import MongoPort from "../../../shared/MongoPort";
import { removeHashPassword, removeSecrets } from "../../../shared/helpers/PortHelper";
import UserDbo, { UserNotPersisted } from "./UserDbo";

export class UserPort extends MongoPort<UserDbo> {
    collectionName = "users";

    joinIndexes = {
        associationVisits: "_id",
    };

    // must be removed with removeSecrets when returning UserDto
    secretFields = ["hashPassword", "jwt"];

    async findAll() {
        return this.collection.find({}).toArray();
    }

    async findByEmail(email: string) {
        const user = await this.collection.findOne({ email: email });
        if (!user) return null;
        return removeSecrets(user);
    }

    async find(query: Filter<UserDbo> = {}, options?: FindOptions): Promise<UserDto[]> {
        const dbos = await this.collection.find(query, options).toArray();
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

    /**
     *
     * @param usersId list of user's id
     * @param fields specific fields to return
     * @returns
     */
    async findPartialUsersById(usersId: string[], fields: Array<keyof UserDto>): Promise<Partial<UserDto>[]> {
        // ensure that we do not return secret fields and remove duplicates
        // secrets should be guarded with typescript Array<keyof UserDto> type but we never know
        // TODO-THOUGHTS: apply projection on others method to remove the use of removeSecrets ?
        // TODO: find a way to prevent duplicates using TS ? But we should always keep those checks
        fields = fields.filter((value, index) => !this.secretFields.includes(value) || fields.indexOf(value) !== index);

        if (!fields) throw new Error("You should not use findPartialUsersById if you want full users data");

        return this.find(
            {
                _id: { $in: usersId.map(id => new ObjectId(id)) },
            },
            {
                projection: fields.reduce(
                    (projection, field) => {
                        projection[field] = 1;
                        return projection;
                    },
                    { _id: 0 },
                ),
            },
        ) as Promise<Partial<UserDbo>[]>;
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

    async updateNbRequests(countByUser: { count: number; _id: string }[]) {
        const bulk = countByUser.map(({ _id, count }) => ({
            updateOne: {
                filter: { _id: new ObjectId(_id) },
                update: { $inc: { nbVisits: count } },
            },
        }));
        if (!bulk.length) return;
        return this.db.collection("users").bulkWrite(bulk);
    }
}

const userPort = new UserPort();

export default userPort;
