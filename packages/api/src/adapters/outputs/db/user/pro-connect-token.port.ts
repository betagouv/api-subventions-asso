import { ObjectId } from "mongodb";
import { ProConnectTokenDbo } from "../../../../modules/user/@types/ProConnectUser";

export default interface ProConnectTokenPort {
    createIndexes(): Promise<void>;

    findLastActive(userId: ObjectId): Promise<ProConnectTokenDbo | null>;
    upsert(entity: Omit<ProConnectTokenDbo, "_id">): Promise<boolean>;
    deleteAllByUserId(userId: string | ObjectId): Promise<boolean>;
}
