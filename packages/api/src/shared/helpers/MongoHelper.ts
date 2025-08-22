import { MongoServerError, ObjectId } from "mongodb";
import { DuplicateIndexError } from "../errors/dbError/DuplicateIndexError";
import { WritableStream, ReadableStream } from "node:stream/web";

export function isMongoDuplicateError(error: unknown): error is MongoServerError {
    if (!(error instanceof MongoServerError)) return false;
    const { code } = error;
    return code ? ["E11000", "11000", 11000].includes(code) : false;
}

export const buildDuplicateIndexError = <T>(error: MongoServerError): DuplicateIndexError<T> | MongoServerError => {
    // MongoServerError default errors are stored in writeErrors
    // c.f https://www.mongodb.com/docs/v4.4/reference/method/db.collection.insertMany/#behaviors
    if (!error.writeErrors && !error.keyValue) return error;
    return new DuplicateIndexError<T>(
        error.message,
        error?.writeErrors?.map(writeError => writeError.err.op as T) || error.keyValue || [],
    );
};

export const buildId = () => {
    return new ObjectId();
};

export const insertStreamByBatch = async <T>(
    readStream: ReadableStream<T>,
    upsertMethod: (batch: T[]) => Promise<unknown>,
    batchSize: number,
) => {
    let buffer: T[] = [];
    let counter = 0;
    const writeStream = new WritableStream({
        async write(entity: T | null) {
            if (!entity) return;
            if (buffer.length === batchSize) {
                await upsertMethod(buffer);
                counter += buffer.length;
                buffer = [];
            }
            buffer.push(entity);
        },
        async close() {
            await upsertMethod(buffer);
            counter += buffer.length;
            console.log(`operations ended successfully, ${counter} entities saved`);
            // TODO differentiate counts inserts and updates?
        },
        async abort(err: Error) {
            console.trace();
            console.error(err);
        },
    });
    await readStream.pipeTo(writeStream);
};
