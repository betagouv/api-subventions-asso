import path from "path";
import { RnaCli } from "../../../../src/adapters/inputs/cli/rna.cli";
import rnaPipeline from "../../../../src/adapters/inputs/pipeline/import/rna/rna.pipeline";
import db from "./../../../../src/shared/MongoConnection";

describe("RNA CLI", () => {
    const cli = new RnaCli(rnaPipeline);

    describe("parse", () => {
        it("it persist data in collection", async () => {
            await cli.parse(path.resolve(__dirname, "../__fixtures__/rna-waldec.parquet"), "2026-07-17");

            // sample only 5 documents to snapshot
            const documents = await db
                .collection("rna")
                .find({}, { limit: 5, projection: { _id: 0 } })
                .toArray();
            expect(documents).toMatchSnapshot();
        });

        it("logs import in data-log", async () => {
            await cli.parse(path.resolve(__dirname, "../__fixtures__/rna-waldec.parquet"), "2026-07-17");
            expect(await db.collection("data-log").findOne({}, { projection: { _id: 0 } })).toMatchSnapshot({
                integrationDate: expect.any(Date),
            });
        });
    });
});
