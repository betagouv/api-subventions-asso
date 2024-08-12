import { PAYMENT_FLAT_ENTITY } from "./__fixtures__/paymentFlatEntity.fixture";
import { PAYMENT_FLAT_DBO } from "./__fixtures__/paymentFlatDbo.fixture";
import paymentFlatPort from "./paymentFlat.port";
import { ObjectId } from "mongodb";
const mockDeleteMany = jest.fn();
const mockInsertOne = jest.fn();

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        deleteMany: mockDeleteMany,
        insertOne: mockInsertOne,
    }),
}));

describe("PaymentFlat Port", () => {
    describe("insertOne()", () => {
        it("should call insertOne with the correct arguments", async () => {
            await paymentFlatPort.insertOne(PAYMENT_FLAT_ENTITY);
            expect(mockInsertOne).toHaveBeenCalledWith({ ...PAYMENT_FLAT_DBO, _id: expect.any(ObjectId) });
        });
    });

    describe("deleteAll()", () => {
        it("should call deleteMany", async () => {
            await paymentFlatPort.deleteAll();
            expect(mockDeleteMany).toHaveBeenCalledWith({});
        });
    });
});