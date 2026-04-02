import UserReset from "../../../modules/user/entities/UserReset";
import { ObjectId, WithId } from "mongodb";

export interface UserResetPort {
    createIndexes(): Promise<void>;

    findByToken(token: string): Promise<UserReset | null>;
    findByUserId(userId: ObjectId | string): Promise<WithId<UserReset>[]>; // todo: remove mongo params
    findOneByUserId(userId: ObjectId | string): Promise<UserReset | null>; // todo: remove mongo params
    create(reset: UserReset): Promise<UserReset>;
    remove(reset: UserReset): Promise<void>;
    removeAllByUserId(userId: ObjectId): Promise<boolean>; // todo: remove mongo params
}
