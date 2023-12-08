import { MongoServerError } from "mongodb";
import { DuplicateIndexError } from "../errors/dbError/DuplicateIndexError";

export const isDuplicateError = error => {
    const { code } = error;
    return ["E11000", "11000", 11000].includes(code);
};

export const buildDuplicateIndexError = (error: MongoServerError): DuplicateIndexError | MongoServerError => {
    // MongoServerError default errors are stored in writeErrors
    // c.f https://www.mongodb.com/docs/v4.4/reference/method/db.collection.insertMany/#behaviors
    if (!error.writeErrors) return error;
    return new DuplicateIndexError(error.message, error.writeErrors.map(writeError => writeError.err.op) || []);
};
