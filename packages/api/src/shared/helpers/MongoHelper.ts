import { MongoServerError } from "mongodb";
import { DuplicateIndexError } from "../errors/dbError/DuplicateIndexError";

export const isDuplicateError = error => {
    const { code } = error;
    return ["E11000", "11000", 11000].includes(code);
};

export const buildDuplicateIndexError = (error: MongoServerError): DuplicateIndexError | MongoServerError => {
    if (!error.writeErrors) return error;
    return new DuplicateIndexError(error.message, error.writeErrors.map(writeError => writeError.err.op) || []);
};
