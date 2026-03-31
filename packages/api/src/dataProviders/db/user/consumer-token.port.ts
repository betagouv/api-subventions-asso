import { ObjectId } from "mongodb";
import { ConsumerToken } from "../../../modules/user/entities/ConsumerToken";

export interface ConsumerTokenPort {
    createIndexes(): Promise<void>;

    findToken(userId: string | ObjectId): Promise<string | undefined>;
    find(userId: string): Promise<ConsumerToken[]>;
    create(entity: ConsumerToken): Promise<boolean>;
    deleteAllByUserId(userId: string | ObjectId): Promise<boolean>;
}
