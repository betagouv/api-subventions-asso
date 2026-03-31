import { ObjectId } from "mongodb";
import { AgentConnectTokenDbo } from "../../../modules/user/@types/AgentConnectUser";

export interface AcTokenPort {
    createIndexes(): Promise<void>;

    findLastActive(userId: ObjectId): Promise<AgentConnectTokenDbo | null>;
    upsert(entity: Omit<AgentConnectTokenDbo, "_id">): Promise<boolean>;
    deleteAllByUserId(userId: string | ObjectId): Promise<boolean>;
}
