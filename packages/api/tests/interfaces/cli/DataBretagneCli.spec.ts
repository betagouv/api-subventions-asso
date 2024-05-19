import axios from "axios";
import DataBretagneCli from "../../../src/interfaces/cli/DataBretagne.cli";
import DataBretagneFixture from "../../__fixtures__/data-bretagne.fixture.json";
import bopPort from "../../../src/dataProviders/db/programme/programme.port";
import { ObjectId } from "mongodb";

describe("DataBretagneCli", () => {
    beforeEach(() => {
        jest.mocked(axios.request).mockResolvedValueOnce({ data: "TOKEN" });
        jest.mocked(axios.request).mockResolvedValue({ data: DataBretagneFixture });
    });

    afterEach(() => {
        jest.mocked(axios.request).mockReset();
    });

    let cli = new DataBretagneCli();

    describe("update()", () => {
        it("should persist bops", async () => {
            await cli.update();
            // @ts-expect-error: access protected for test
            const bops = (await bopPort.collection.find({}).toArray()).map(bop => ({
                ...bop,
                _id: expect.any(ObjectId),
            }));
            expect(bops).toMatchSnapshot();
        });
    });
});
