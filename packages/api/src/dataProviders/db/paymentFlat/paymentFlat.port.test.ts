import { PAYMENT_FLAT_ENTITY } from "../../../modules/paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import PaymentFlatAdapter from "../../../modules/paymentFlat/paymentFlatAdapter";
import { PAYMENT_FLAT_DBO } from "./__fixtures__/paymentFlatDbo.fixture";
import paymentFlatPort from "./paymentFlat.port";
import { ObjectId } from "mongodb";
const mockDeleteMany = jest.fn();
const mockInsertOne = jest.fn();
const mockUpdateOne = jest.fn();

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        deleteMany: mockDeleteMany,
        insertOne: mockInsertOne,
        updateOne: mockUpdateOne,
    }),
}));

describe("PaymentFlat Port", () => {
    beforeEach(() => {
        jest.spyOn(PaymentFlatAdapter, "toDbo").mockReturnValue(PAYMENT_FLAT_DBO);
    });

    describe("insertOne()", () => {
        it("should call insertOne with the correct arguments", async () => {
            await paymentFlatPort.insertOne(PAYMENT_FLAT_ENTITY);
            expect(mockInsertOne).toHaveBeenCalledWith(PAYMENT_FLAT_DBO);
        });
    });

    describe("upsertOne()", () => {
        it("should call toDbo()", async () => {
            await paymentFlatPort.upsertOne(PAYMENT_FLAT_ENTITY);
            expect(mockUpdateOne).toHaveBeenCalledWith(
                { uniqueId: PAYMENT_FLAT_DBO.uniqueId },
                { $set: PAYMENT_FLAT_DBO },
                { upsert: true },
            );
        });
    });

    describe("deleteAll()", () => {
        it("should call deleteMany", async () => {
            await paymentFlatPort.deleteAll();
            expect(mockDeleteMany).toHaveBeenCalledWith({});
        });
    });

    describe("cursorFindChorusOnly()", () => {
        let mockCursorFind: jest.SpyInstance;
        beforeAll(() => {
            mockCursorFind = jest.spyOn(paymentFlatPort, "cursorFind").mockImplementation(jest.fn());
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should call cursorFind with provider filter", () => {
            paymentFlatPort.cursorFindChorusOnly();
            expect(mockCursorFind).toHaveBeenCalledWith({ provider: "chorus" });
        });

        it("should call cursorFind with provider and exerciceBudgetaire filter", () => {
            const exerciceBudgetaire = 2021;
            paymentFlatPort.cursorFindChorusOnly(exerciceBudgetaire);
            expect(mockCursorFind).toHaveBeenCalledWith({ provider: "chorus", exerciceBudgetaire: exerciceBudgetaire });
        });
    });
});
