import path from "path";
import fs from "fs";
import { createSireneStockUniteLegaleCli } from "../../../src/adapters/inputs/cli/sirene-stock-unite-legale.cli";
import uniteLegalNameAdapter from "../../../src/adapters/outputs/db/unite-legale-name/unite-legale-name.adapter";
import uniteLegaleEntrepriseAdapter from "../../../src/adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.adapter";
import sireneUniteLegaleAdapter from "../../../src/adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import { sireneStockUniteLegaleAdapter } from "../../../src/adapters/outputs/api/data-gouv/data-gouv.adapter";

const PARQUET_PATH = path.resolve(__dirname, "../../../src/modules/providers/sirene/__fixtures__");

describe("SireneStockUniteLegaleCli", () => {
    let getFileStreamMock: jest.SpyInstance;

    beforeAll(() => {
        getFileStreamMock = jest.spyOn(sireneStockUniteLegaleAdapter, "getFileStream").mockImplementation(() =>
            Promise.resolve({
                data: fs.createReadStream(PARQUET_PATH + "/StockUniteLegale.parquet"),
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
            // @ts-expect-error: access protected for test
            const data = await sireneUniteLegaleAdapter.collection.find({}, { projection: { _id: 0 } }).toArray();
            expect(data).toMatchSnapshot();
        });

        it("should persist asso names", async () => {
            await cli.import();
            // @ts-expect-error: access protected for test
            const data = await uniteLegalNameAdapter.collection.find({}, { projection: { _id: 0 } }).toArray();
            expect(data).toMatchSnapshot();
        });

        it("should persist entreprises' siret", async () => {
            await cli.import();
            // @ts-expect-error: access protected for test
            const data = await uniteLegaleEntrepriseAdapter.collection.find({}, { projection: { _id: 0 } }).toArray();
            expect(data).toMatchSnapshot();
        });
    });
});
