import path from "path";
import fs from "fs";
import { createSireneStockUniteLegaleCli } from "../../../../src/adapters/inputs/cli/sirene-stock-unite-legale.cli";
import { sireneStockUniteLegaleAdapter } from "../../../../src/adapters/outputs/api/data-gouv/data-gouv.adapter";
import db from "../../../../src/shared/MongoConnection";

const PARQUET_PATH = path.resolve(__dirname, "./../__fixtures__");

describe("SireneStockUniteLegaleCli", () => {
    let getFileStreamMock: jest.SpyInstance;

    beforeAll(() => {
        getFileStreamMock = jest.spyOn(sireneStockUniteLegaleAdapter, "getFileStream").mockImplementation(() =>
            Promise.resolve({
                data: fs.createReadStream(PARQUET_PATH + "/remote.sirene-stock-unite-legale.parquet"),
                status: 200,
                statusText: "OK",
            }),
        );
    });

    afterAll(() => {
        getFileStreamMock.mockReset();
    });

    const cli = createSireneStockUniteLegaleCli();
    describe("import", () => {
        it("should persist sirene data", async () => {
            await cli.import();
            const data = await db
                .collection("sirene")
                .find({}, { projection: { _id: 0 } })
                .toArray();
            expect(data).toMatchSnapshot();
        });

        it("should persist associaton search documents", async () => {
            await cli.import();
            const data = await db
                .collection("association-search")
                .find({}, { projection: { _id: 0 } })
                .toArray();

            expect(data).toMatchSnapshot();
        });

        it("should persist entreprises' siret", async () => {
            await cli.import();
            const data = await db
                .collection("unite-legal-entreprise")
                .find({}, { projection: { _id: 0 } })
                .toArray();
            expect(data).toMatchSnapshot();
        });
    });
});
