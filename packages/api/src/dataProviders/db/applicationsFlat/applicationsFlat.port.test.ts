import { ObjectId } from "mongodb";
import { APPLICATIONS_FLAT_ENTITY, APPLICATIONS_FLAT_DBO } from "./__fixtures__/applicationsFlat.fixture";
import applicationsFlatPort from "./applicationsFlat.port";

const mockDeleteMany = jest.fn();
const mockInsertOne = jest.fn();

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        deleteMany: mockDeleteMany,
        insertOne: mockInsertOne,
    }),
}));

describe("ApplicationsFlat Port", () => {
    describe("insertOne()", () => {
        it("should call insertOne with the correct arguments", async () => {
            await applicationsFlatPort.insertOne(APPLICATIONS_FLAT_ENTITY);
            expect(mockInsertOne).toHaveBeenCalledWith({ ...APPLICATIONS_FLAT_DBO, _id: expect.any(ObjectId) });
        });
    });

    describe("deleteAll()", () => {
        it("should call deleteMany", async () => {
            await applicationsFlatPort.deleteAll();
            expect(mockDeleteMany).toHaveBeenCalledWith({});
        });
    });
});
