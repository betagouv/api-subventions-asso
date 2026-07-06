import { Filter, FindOptions, ObjectId } from "mongodb";
import UserEntity from "../../../../domain/users/UserEntity";
import { UserDbo } from "./user.dbo";
import NewUserEntity from "../../../../domain/users/NewUserEntity";

export interface UserPort {
    createIndexes(): Promise<void>;

    create(user: NewUserEntity): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity | null>;
    find(query: Filter<UserDbo>, options?: FindOptions): Promise<UserEntity[]>; // todo: remove mongo params
    findByIds(ids: string[]): Promise<Omit<UserEntity, "jwt" | "hashPassword">[]>;
    findById(userId: ObjectId | string): Promise<UserEntity | null>; // todo: remove mongo params
    findByPeriod(begin: Date, end: Date, withAdmin: boolean): Promise<UserEntity[]>;
    findInactiveSince(date: Date): Promise<UserEntity[]>;
    findNotActivatedSince(date: Date, lastWarned: Date | undefined): Promise<UserEntity[]>;
    update(user: Partial<UserEntity>, withJwt: boolean): Promise<UserEntity | Omit<UserEntity, "hashPassword">>;
    removeJwt(userId: string): Promise<UserEntity>;
    delete(user: UserEntity): Promise<boolean>;

    getUserWithSecretsByEmail(email: string): Promise<UserEntity | null>;
    getUserWithSecretsById(id: string): Promise<UserEntity | null>;
    countTotalUsersOnDate(date, withAdmin: boolean): Promise<number>;
    updateNbRequests(countByUser: { count: number; _id: string }[]): Promise<void>;
}
