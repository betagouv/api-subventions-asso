import { ProConnectTokenDbo } from "../../../../modules/user/@types/ProConnectUser";

export default interface ProConnectTokenPort {
    createIndexes(): Promise<void>;

    findLastActive(userId: string): Promise<ProConnectTokenDbo | null>;
    upsert(entity: Omit<ProConnectTokenDbo, "_id" | "userId">): Promise<boolean>;
    deleteAllByUserId(userId: string): Promise<boolean>;
}
