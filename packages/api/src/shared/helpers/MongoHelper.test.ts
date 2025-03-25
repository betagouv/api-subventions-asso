import { MongoServerError } from "mongodb";
import { buildDuplicateIndexError, isMongoDuplicateError } from "./MongoHelper";
import { DuplicateIndexError } from "../errors/dbError/DuplicateIndexError";

describe("MongoHelper", () => {
    describe("isMongoDuplicateError", () => {
        it.each`
            error
            ${new MongoServerError({ message: "", code: "E11000" })}
            ${new MongoServerError({ message: "", code: "11000" })}
            ${new MongoServerError({ message: "", code: 11000 })}
        `("should return true", ({ error }) => {
            const actual = isMongoDuplicateError(error);
            expect(actual).toEqual(true);
        });

        it.each`
            error
            ${new MongoServerError({ message: "", code: "E10000" })}
            ${new MongoServerError({ message: "", code: "1000" })}
            ${new MongoServerError({ message: "", code: 1000 })}
            ${new MongoServerError({ message: "" })}
            ${new Error()}
        `("should return false", ({ error }) => {
            const actual = isMongoDuplicateError(error);
            expect(actual).toEqual(false);
        });
    });

    describe("buildDuplicateIndexError", () => {
        it("should return DuplicateIndexError", () => {
            const MONGO_SERVER_ERROR = new MongoServerError({ message: "duplicate E11000" });
            MONGO_SERVER_ERROR.code = "11000";
            MONGO_SERVER_ERROR.writeErrors = [];
            const expected = DuplicateIndexError.name;
            const actual = buildDuplicateIndexError(MONGO_SERVER_ERROR).constructor.name;
            expect(actual).toEqual(expected);
        });

        it("should return MongoServerError if no writeErrors", () => {
            const MONGO_SERVER_ERROR = new MongoServerError({ message: "duplicate E11000" });
            MONGO_SERVER_ERROR.code = "11000";
            const expected = MONGO_SERVER_ERROR;
            const actual = buildDuplicateIndexError(MONGO_SERVER_ERROR);
            expect(actual).toEqual(expected);
        });
    });
});
