import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    LIST_PAYMENT_FLAT_ENTITY,
} from "../../../modules/paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import PaymentFlatMapper from "../../../modules/paymentFlat/payment-flat.mapper";
import { PAYMENT_FLAT_DBO } from "./__fixtures__/paymentFlatDbo.fixture";
import paymentFlatPort from "./paymentFlat.port";
const mockDeleteMany = jest.fn();
const mockInsertOne = jest.fn();
const mockUpdateOne = jest.fn();
const mockBulkWrite = jest.fn();

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        deleteMany: mockDeleteMany,
        insertOne: mockInsertOne,
        updateOne: mockUpdateOne,
        bulkWrite: mockBulkWrite,
    }),
}));

describe("PaymentFlat Port", () => {
    beforeEach(() => {
        jest.spyOn(PaymentFlatMapper, "toDbo").mockReturnValue(PAYMENT_FLAT_DBO);
    });

    describe("insertOne()", () => {
        it("should call insertOne with the correct arguments", async () => {
            await paymentFlatPort.insertOne(CHORUS_PAYMENT_FLAT_ENTITY);
            expect(mockInsertOne).toHaveBeenCalledWith(PAYMENT_FLAT_DBO);
        });
    });

    describe("upsertOne()", () => {
        it("should call toDbo()", async () => {
            await paymentFlatPort.upsertOne(CHORUS_PAYMENT_FLAT_ENTITY);
            expect(mockUpdateOne).toHaveBeenCalledWith(
                { idUnique: PAYMENT_FLAT_DBO.idUnique },
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

    describe("upsertMany", () => {
        // @ts-expect-error: mock private method
        const mockBuildUpsertOperation = jest.spyOn(paymentFlatPort, "buildUpsertOperation");
        const mockToDbo = jest.spyOn(PaymentFlatMapper, "toDbo");

        // @ts
        beforeAll(() =>
            // @ts-expect-error: mock
            mockBuildUpsertOperation.mockImplementation(entity => ({
                upsertOne: entity,
            })),
        );

        // override toDbo implementation at the beginning of the file
        // @ts-expect-error: mock
        beforeEach(() => mockToDbo.mockImplementation(entity => entity));

        afterAll(() => {
            mockBuildUpsertOperation.mockRestore();
            mockToDbo.mockReset();
        });

        it("should call buildUpsertOperation for each entity", () => {
            paymentFlatPort.upsertMany(LIST_PAYMENT_FLAT_ENTITY);
            LIST_PAYMENT_FLAT_ENTITY.map((entity, index) =>
                expect(mockBuildUpsertOperation).toHaveBeenNthCalledWith(index + 1, entity),
            );
        });

        it("should call toDbo for each entity", () => {
            paymentFlatPort.upsertMany(LIST_PAYMENT_FLAT_ENTITY);
            LIST_PAYMENT_FLAT_ENTITY.map((entity, index) =>
                expect(mockToDbo).toHaveBeenNthCalledWith(index + 1, entity),
            );
        });

        it("should call bulk operation", () => {
            // cf mock implementation
            const expected = LIST_PAYMENT_FLAT_ENTITY.map(entity => ({ upsertOne: entity }));
            paymentFlatPort.upsertMany(LIST_PAYMENT_FLAT_ENTITY);
            expect(mockBulkWrite).toHaveBeenCalledWith(expected, { ordered: false });
        });
    });

    describe("buildUpsertOperation", () => {
        it("returns bulk operation", () => {
            const { _id, ...entity } = PAYMENT_FLAT_DBO;
            // @ts-expect-error: test private method
            const actual = paymentFlatPort.buildUpsertOperation(entity);
            expect(actual).toMatchSnapshot({});
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
            expect(mockCursorFind).toHaveBeenCalledWith({ fournisseur: "chorus" });
        });

        it("should call cursorFind with provider and exerciceBudgetaire filter", () => {
            const exerciceBudgetaire = 2021;
            paymentFlatPort.cursorFindChorusOnly(exerciceBudgetaire);
            expect(mockCursorFind).toHaveBeenCalledWith({
                fournisseur: "chorus",
                exerciceBudgetaire: exerciceBudgetaire,
            });
        });
    });
});
