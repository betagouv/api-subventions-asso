import { MongoServerError } from "mongodb";
import { DuplicateIndexError } from "../errors/dbError/DuplicateIndexError";

export const isDuplicateError = (error: MongoServerError) => {
    const { code } = error;
    if (!code) return false;
    return ["E11000", "11000", 11000].includes(code);
};

export const buildDuplicateIndexError = <T>(error: MongoServerError): DuplicateIndexError<T> | MongoServerError => {
    // MongoServerError default errors are stored in writeErrors
    // c.f https://www.mongodb.com/docs/v4.4/reference/method/db.collection.insertMany/#behaviors
    if (!error.writeErrors) return error;
    return new DuplicateIndexError<T>(error.message, error.writeErrors.map(writeError => writeError.err.op as T) || []);
};
