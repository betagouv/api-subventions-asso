import axios from "axios";
import DataBretagneCli from "../../../src/interfaces/cli/DataBretagne.cli";
import DataBretagneFixture from "../../__fixtures__/data-bretagne.fixture.json";
import bopAdapter from "../../../src/dataProviders/db/state-budget-program/stateBudgetProgram.adapter";
import { ObjectId } from "mongodb";
import dataLogAdapter from "../../../src/dataProviders/db/data-log/dataLog.adapter";

describe("DataBretagneCli", () => {
    beforeEach(() => {
        jest.mocked(axios.request).mockResolvedValueOnce({ data: "TOKEN" });
        jest.mocked(axios.request).mockResolvedValue({ data: DataBretagneFixture });
    });

    afterEach(() => {
        jest.mocked(axios.request).mockReset();
    });

    const cli = new DataBretagneCli();

    describe("resync()", () => {
        it("should persist state budget programs", async () => {
            await cli.resync();
            // @ts-expect-error: access protected for test
            const programs = (await bopAdapter.collection.find({}).toArray()).map(program => ({
                ...program,
                _id: expect.any(ObjectId),
            }));
            expect(programs).toMatchSnapshot();
        });

        it("should register new import", async () => {
            await cli.resync();
            const actual = await dataLogAdapter.findAll();
            expect(actual?.[0]).toMatchObject({
                editionDate: expect.any(Date),
                integrationDate: expect.any(Date),
                providerId: "data-bretagne",
            });
        });
    });
});
