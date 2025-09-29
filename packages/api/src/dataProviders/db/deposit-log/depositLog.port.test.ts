import depositLogPort from "./depositLog.port";
import {
    DEPOSIT_LOG_DBO,
    DEPOSIT_LOG_ENTITY,
} from "../../../modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import DepositLogAdapter from "./DepositLog.adapter";

const mockInsertOne = jest.fn();
const mockFindOne = jest.fn();
const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 });

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        insertOne: mockInsertOne,
        findOne: mockFindOne,
        deleteOne: mockDeleteOne,
    }),
}));

describe("Deposit Log Port", () => {
    beforeEach(() => {
        jest.spyOn(DepositLogAdapter, "toDbo").mockReturnValue(DEPOSIT_LOG_DBO);
    });

    describe("insertOne()", () => {
        it("should call insertOne with the correct argument", async () => {
            await depositLogPort.insertOne(DEPOSIT_LOG_ENTITY);
            expect(mockInsertOne).toHaveBeenCalledWith(DEPOSIT_LOG_DBO);
        });
    });

    describe("findOneByUserId()", () => {
        it("should call findOneByUserId with the correct query", async () => {
            const query = "user123";
            await depositLogPort.findOneByUserId(query);
            expect(mockFindOne).toHaveBeenCalledWith({ userId: query });
        });
    });

    describe("deleteOneByUserId()", () => {
        it("should call deleteOneByUserId with the correct query", async () => {
            const query = "user123";
            await depositLogPort.deleteByUserId(query);
            expect(mockDeleteOne).toHaveBeenCalledWith({ userId: query });
        });
    });
});
