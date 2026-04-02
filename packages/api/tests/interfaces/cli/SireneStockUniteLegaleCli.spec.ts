import path from "path";
import fs from "fs";
import sireneStockUniteLegaleApiAdapter from "../../../src/adapters/api/sirene/sirene-stock-unite-legale.adapter";
import sireneStockUniteLegaleDbAdapter from "../../../src/adapters/db/sirene/stock-unite-legale/sirene-stock-unite-legale.adapter";
import SireneStockUniteLegaleCli from "../../../src/interfaces/cli/SireneStockUniteLegale.cli";
import { ObjectId } from "mongodb";
import uniteLegalNameAdapter from "../../../src/adapters/db/unite-legale-name/unite-legale-name.adapter";
import uniteLegalEntrepriseAdapter from "../../../src/adapters/db/unite-legale-entreprise/unite-legale-entreprise.adapter";

const ZIP_PATH = path.resolve(__dirname, "../../../src/modules/providers/sirene/__fixtures__");

describe("SireneStockUniteLegaleCli", () => {
    beforeAll(() => {
        jest.spyOn(sireneStockUniteLegaleApiAdapter, "getZip").mockImplementation(() =>
            Promise.resolve({
                data: fs.createReadStream(ZIP_PATH + "/StockUniteLegale_utf8.zip"),
                status: 200,
                statusText: "OK",
            }),
        );
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    const cli = new SireneStockUniteLegaleCli();
    describe("import", () => {
        it("should persist sirene data", async () => {
            await cli.import();
            // @ts-expect-error: access protected for test
            const data = (await sireneStockUniteLegaleDbAdapter.collection.find({}).toArray()).map(object => ({
                ...object,
                _id: expect.any(ObjectId),
            }));
            expect(data).toMatchSnapshot();
        });

        it("should persist asso names", async () => {
            await cli.import();
            // @ts-expect-error: access protected for test
            const data = (await uniteLegalNameAdapter.collection.find({}).toArray()).map(object => ({
                ...object,
                _id: expect.any(ObjectId),
            }));
            expect(data).toMatchSnapshot();
        });

        it("should persist entreprises' siret", async () => {
            await cli.import();
            // @ts-expect-error: access protected for test
            const data = (await uniteLegalEntrepriseAdapter.collection.find({}).toArray()).map(object => ({
                ...object,
                _id: expect.any(ObjectId),
            }));
            expect(data).toMatchSnapshot();
        });
    });
});
