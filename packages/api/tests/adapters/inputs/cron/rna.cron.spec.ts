import rnaCron from "../../../../src/adapters/inputs/cron/rna.cron";
import db from "../../../../src/shared/MongoConnection";
import fs from "fs";
import path from "path";
import axios from "axios";

jest.mock("axios");

describe("RNA CRON", () => {
    const fixtureStream = fs.createReadStream(
        path.join(__dirname, "../__fixtures__", "multiple-batch.rna-waldec.parquet"),
    );

    beforeEach(() => {
        jest.mocked(axios.request).mockResolvedValue({
            data: fixtureStream,
            status: 200,
            headers: {},
        });
    });

    describe("import", () => {
        it("import RNA", async () => {
            await rnaCron.import();
            const dbos = db.collection("rna").find({}).toArray();
            expect(dbos).toMatchSnapshot();
        });
    });
});
