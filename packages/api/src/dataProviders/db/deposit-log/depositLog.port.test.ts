import depositLogPort from "./depositLog.port";
import {
    DEPOSIT_LOG_DBO,
    DEPOSIT_LOG_ENTITY,
} from "../../../modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import DepositLogMapper from "./deposit-log.mapper";
import { NotFoundError } from "core";

const mockInsertOne = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 });
const mockFindOneAndUpdate = jest.fn();

jest.mock("./deposit-log.mapper");
jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        insertOne: mockInsertOne,
        find: mockFind.mockImplementation(() => ({ toArray: async () => [DEPOSIT_LOG_DBO] })),
        findOne: mockFindOne,
        deleteOne: mockDeleteOne,
        findOneAndUpdate: mockFindOneAndUpdate,
    }),
}));

describe("Deposit Log Port", () => {
    let mockToDbo: jest.SpyInstance;
    let mockDboToEntity: jest.SpyInstance;
    beforeEach(() => {
        mockToDbo = jest.spyOn(DepositLogMapper, "toDbo").mockReturnValue(DEPOSIT_LOG_DBO);
        mockDboToEntity = jest.spyOn(DepositLogMapper, "dboToEntity").mockReturnValue(DEPOSIT_LOG_ENTITY);
    });

    describe("insertOne()", () => {
        it("should call insertOne with the correct argument", async () => {
            await depositLogPort.insertOne(DEPOSIT_LOG_ENTITY);
            expect(mockInsertOne).toHaveBeenCalledWith(DEPOSIT_LOG_DBO);
        });

        it("adapts to dbo before inserting", async () => {
            await depositLogPort.insertOne(DEPOSIT_LOG_ENTITY);
            expect(mockToDbo).toHaveBeenCalledWith(DEPOSIT_LOG_ENTITY);
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

    describe("findAllFromFullDay", () => {
        const date = new Date("2025-10-15");

        it("calls find with the correct search query", async () => {
            await depositLogPort.findAllFromFullDay(date);
            expect(mockFind).toHaveBeenCalledWith({ updateDate: { $gte: date, $lt: new Date("2025-10-16") } });
        });

        it("adapts dbos to entities", async () => {
            await depositLogPort.findAllFromFullDay(date);
            expect(mockDboToEntity).toHaveBeenCalledWith(DEPOSIT_LOG_DBO);
        });

        it("returns entities", async () => {
            const actual = await depositLogPort.findAllFromFullDay(date);
            const expected = [DEPOSIT_LOG_ENTITY];
            expect(actual).toEqual(expected);
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
