import { MongoServerError, ObjectId } from "mongodb";
import { DuplicateIndexError } from "../errors/dbError/DuplicateIndexError";

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
