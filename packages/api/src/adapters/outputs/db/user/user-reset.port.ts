import { ObjectId } from "mongodb";
import { UserResetEntity } from "../../../../modules/user/entities/UserResetEntity";

export interface UserResetPort {
    createIndexes(): Promise<void>;

    // @TODO: make a UserResetEntity
    findByToken(token: string): Promise<UserResetEntity | null>;
    findByUserId(userId: ObjectId | string): Promise<UserResetEntity[]>;
    findOneByUserId(userId: ObjectId | string): Promise<UserResetEntity | null>;
    create(reset: UserResetEntity): Promise<UserResetEntity>;
    remove(reset: UserResetEntity): Promise<void>;
    removeAllByUserId(userId: string): Promise<boolean>;
}
