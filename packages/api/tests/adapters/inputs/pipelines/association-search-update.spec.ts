import path from "path";
import fs from "fs";
import { RnaCli } from "../../../../src/adapters/inputs/cli/rna.cli";
import { createSireneStockUniteLegaleCli } from "../../../../src/adapters/inputs/cli/sirene-stock-unite-legale.cli";
import rnaPipeline from "../../../../src/adapters/inputs/pipeline/import/rna/rna.pipeline";
import db from "../../../../src/shared/MongoConnection";
import { sireneStockUniteLegaleAdapter } from "../../../../src/adapters/outputs/api/data-gouv/data-gouv.adapter";

// @TODO: make siren in both unite legale and rna parquet file linked to fully test this
describe("Association Search Update", () => {
    it("should be the merge of unite legale and rna", async () => {
        jest.spyOn(sireneStockUniteLegaleAdapter, "getFileStream").mockImplementation(() =>
            Promise.resolve({
                data: fs.createReadStream(
                    path.resolve(__dirname, "./../__fixtures__") + "/remote.sirene-stock-unite-legale.parquet",
                ),
                status: 200,
                statusText: "OK",
            }),
        );

        await createSireneStockUniteLegaleCli().import();
        await new RnaCli(rnaPipeline).parse(
            path.resolve(__dirname, "../__fixtures__/multiple-batch.rna-waldec.parquet"),
            "2026-07-17",
        );
        expect(await db.collection("association-search").find({}, { limit: 10 }).toArray()).toMatchSnapshot();
    });
});
