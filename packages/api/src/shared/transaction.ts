import { ClientSession } from "mongodb";
import { client } from "./MongoConnection";
import { AsyncLocalStorage } from "node:async_hooks";

const transactionContext = new AsyncLocalStorage<ClientSession>();

export function getCurrentSession(): ClientSession | undefined {
    return transactionContext.getStore();
}

export async function runTransaction<R>(fn: () => Promise<R>): Promise<R> {
    const existingSession = getCurrentSession();
    if (existingSession) return fn();

    const session = client.startSession();
    let attempt = 0;

    try {
        return await session.withTransaction(
            async () => {
                attempt++;
                console.log(attempt);
                return await transactionContext.run(session, fn);
            },
            {
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                readPreference: "primary",
                maxCommitTimeMS: 3 * 60 * 1000,
            },
        );
    } catch (error) {
        console.log("error during transaction", error);
        throw error;
    } finally {
        await session.endSession();
    }
}
