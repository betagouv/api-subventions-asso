import { MongoServerError } from "mongodb";
import { buildDuplicateIndexError, isDuplicateError } from "./MongoHelper";
import { DuplicateIndexError } from "../errors/dbError/DuplicateIndexError";

describe("MongoHelper", () => {
    describe("isDuplicateError", () => {
        it.each`
            error
            ${{ code: "E11000" }}
            ${{ code: "11000" }}
            ${{ code: 11000 }}
        `("should return true", ({ error }) => {
            const actual = isDuplicateError(error);
            expect(actual).toEqual(true);
        });

        it.each`
            error
            ${{ code: "E10000" }}
            ${{ code: "1000" }}
            ${{ code: 1000 }}
            ${new Error()}
        `("should return false", ({ error }) => {
            const actual = isDuplicateError(error);
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
