import { ObjectId } from "mongodb";
import { ConsumerToken } from "../../../../modules/user/entities/ConsumerToken";

export interface ConsumerTokenPort {
    createIndexes(): Promise<void>;

    findToken(userId: string | ObjectId): Promise<string | undefined>;
    // @TODO: make a ConsumerTokenEntity
    find(userId: string): Promise<(Omit<ConsumerToken, "_id" | "userId"> & { userId: string })[]>;
    create(entity: ConsumerToken): Promise<boolean>;
    deleteAllByUserId(userId: string | ObjectId): Promise<boolean>;
}
