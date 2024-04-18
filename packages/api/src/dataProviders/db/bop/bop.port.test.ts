import { BOP_DBOS } from "./__fixtures__/BopDbo.fixture";
import bopPort, { BopPort } from "./bop.port";
import db from "../../../shared/MongoConnection";

const mockDeleteMany = jest.fn(param => {
    console.log("delete many !!", param);
});

const mockInsertMany = jest.fn(param => {
    console.log("insert many !!", param);
});

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        deleteMany: mockDeleteMany,
        insertMany: mockInsertMany,
    }),
}));

describe("Bop Port", () => {
    describe("replace()", () => {
        it("should call deleteMany", async () => {
            // @ts-expect-error: ok
            await bopPort.replace(BOP_DBOS);
            expect(mockDeleteMany).toHaveBeenCalledWith({});
        });

        it("should call replace", async () => {
            // @ts-expect-error: ok
            await bopPort.replace(BOP_DBOS);
            expect(mockInsertMany).toHaveBeenCalledWith(BOP_DBOS);
        });
    });
});
