import path from "path";
import fs from "fs";
import rnaCli from "../../../../src/adapters/inputs/cli/rna.cli";
import { createSireneStockUniteLegaleCli } from "../../../../src/adapters/inputs/cli/sirene-stock-unite-legale.cli";
import db from "../../../../src/shared/MongoConnection";
import { sireneStockUniteLegaleAdapter } from "../../../../src/adapters/outputs/api/data-gouv/data-gouv.adapter";
import { createEstablishmentCli } from "../../../../src/adapters/inputs/cli/establishment.cli";

async function importRna() {
    await rnaCli.parse(path.resolve(__dirname, "../__fixtures__/diff-maj-time.rna-waldec.parquet"), "2026-07-17");
}

async function importUniteLegale() {
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
}

async function importEstablishment() {
    await createEstablishmentCli().parse(
        path.resolve(__dirname, "../__fixtures__/sirene-establishment.parquet"),
        "2026-07-21",
    );
}

async function importAll() {
    await importUniteLegale();
    await importEstablishment();
    await importRna();
}

// @TODO: make siren in both unite legale and rna parquet file linked to fully test this
describe("Association Search Update", () => {
    it("should be the merge of unite legale and rna", async () => {
        await importAll();
        await expect(
            await db
                .collection("association-search")
                .find({}, { projection: { _id: 0 } })
                .toArray(),
        ).toMatchSnapshot(); // nothing relevant to siren 100000001 should be stored as it is no an association (legal category from unite legale)
    });
});
