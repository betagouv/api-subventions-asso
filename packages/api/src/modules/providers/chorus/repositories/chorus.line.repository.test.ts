import { MongoServerError } from "mongodb";
import chorusLineRepository from "./chorus.line.repository";
import MongoRepository from "../../../../shared/MongoRepository";
import * as MongoHelper from "../../../../shared/helpers/MongoHelper";
const mockedMongoHelper = jest.mocked(MongoHelper);
jest.mock("../../../../shared/helpers/MongoHelper");
describe("ChorusLineRepository", () => {
    const MONGO_SERVER_ERROR = new MongoServerError({ message: "Duplicate Error" });
    MONGO_SERVER_ERROR.code = 11000;
    MONGO_SERVER_ERROR.writeErrors = [];

    let mockInsertMany = jest.fn().mockRejectedValue(MONGO_SERVER_ERROR);

    let mockMongoRepositoryCollection: jest.SpyInstance;
    beforeAll(() => {
        mockMongoRepositoryCollection = jest
            // @ts-expect-error: test
            .spyOn(MongoRepository.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({ insertMany: mockInsertMany });
    });

    afterEach(() => mockInsertMany.mockReset());

    describe("insertMany", () => {
        beforeEach(() => {
            mockedMongoHelper.isDuplicateError.mockReturnValue(true);
        });

        it("should call buildDuplicateIndexError", async () => {
            await chorusLineRepository
                .insertMany([])
                .catch(e => {})
                .finally(() => {
                    expect(mockedMongoHelper.buildDuplicateIndexError).toHaveBeenCalledWith(MONGO_SERVER_ERROR);
                });
        });
    });
});
