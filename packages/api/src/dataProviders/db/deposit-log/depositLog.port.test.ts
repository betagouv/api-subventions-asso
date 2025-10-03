import depositLogPort from "./depositLog.port";
import {
    DEPOSIT_LOG_DBO,
    DEPOSIT_LOG_ENTITY,
} from "../../../modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import DepositLogAdapter from "./DepositLog.adapter";
import { NotFoundError } from "core";

const mockInsertOne = jest.fn();
const mockFindOne = jest.fn();
const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 });
const mockFindOneAndUpdate = jest.fn();

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        insertOne: mockInsertOne,
        findOne: mockFindOne,
        deleteOne: mockDeleteOne,
        findOneAndUpdate: mockFindOneAndUpdate,
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

        it("should return null when no deposit is found", async () => {
            mockFindOne.mockResolvedValueOnce(null);
            const query = "user123";
            const result = await depositLogPort.findOneByUserId(query);
            expect(result).toBeNull();
        });
    });

    describe("deleteOneByUserId()", () => {
        it("should call deleteOneByUserId with the correct arguments", async () => {
            const query = "user123";
            await depositLogPort.deleteByUserId(query);
            expect(mockDeleteOne).toHaveBeenCalledWith({ userId: query });
        });
    });

    describe("updatePartial()", () => {
        it("should call updatePartial with the correct arguments", async () => {
            mockFindOneAndUpdate.mockResolvedValueOnce(DEPOSIT_LOG_DBO);
            await depositLogPort.updatePartial(DEPOSIT_LOG_ENTITY);
            const { step, userId, ...toUpdate } = DEPOSIT_LOG_ENTITY;
            expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
                { userId },
                {
                    $set: expect.objectContaining({
                        ...toUpdate,
                        updateDate: expect.any(Date),
                    }),
                    $max: { step },
                },
                { returnDocument: "after" },
            );
        });

        it("should throw NotFoundError", async () => {
            mockFindOneAndUpdate.mockResolvedValueOnce(null);
            await expect(depositLogPort.updatePartial(DEPOSIT_LOG_ENTITY)).rejects.toThrow(NotFoundError);
        });
    });
});
