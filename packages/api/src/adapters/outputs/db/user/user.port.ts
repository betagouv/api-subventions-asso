import { UserDto } from "dto";
import { Filter, FindOptions, ObjectId } from "mongodb";
import UserDbo, { UserNotPersisted } from "./@types/UserDbo";

export interface UserPort {
    createIndexes(): Promise<void>;

    findAll(): Promise<UserDto[]>;
    findByEmail(email: string): Promise<UserDto | null>;
    find(query: Filter<UserDbo>, options?: FindOptions): Promise<UserDto[]>; // todo: remove mongo params
    findByIds(ids: string[]): Promise<Omit<UserDbo, "jwt" | "hashPassword">[]>;
    findById(userId: ObjectId | string): Promise<UserDto | null>; // todo: remove mongo params
    findByPeriod(begin: Date, end: Date, withAdmin: boolean): Promise<UserDto[]>;
    findPartialUsersById(usersId: string[], fields: Array<keyof UserDto>): Promise<Partial<UserDto>[]>;
    findInactiveSince(date: Date): Promise<UserDto[]>;
    findNotActivatedSince(date: Date, lastWarned: Date | undefined): Promise<UserDto[]>;
    update(user: Partial<UserDbo>, withJwt: boolean): Promise<UserDto | Omit<UserDbo, "hashPassword">>;
    delete(user: UserDto): Promise<boolean>;
    create(user: UserNotPersisted): Promise<UserDto>;
    createAndReturnWithJWT(user: UserNotPersisted): Promise<Omit<UserDbo, "hashPassword">>;
    getUserWithSecretsByEmail(email: string): Promise<UserDbo | null>;
    getUserWithSecretsById(id: ObjectId): Promise<UserDbo | null>;
    countTotalUsersOnDate(date, withAdmin: boolean): Promise<number>;
    updateNbRequests(countByUser: { count: number; _id: string }[]): Promise<void>;
}
