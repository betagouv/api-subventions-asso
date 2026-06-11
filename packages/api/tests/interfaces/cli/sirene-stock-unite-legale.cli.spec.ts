import path from "path";
import fs from "fs";
import sireneStockUniteLegaleApiAdapter from "../../../src/adapters/outputs/api/sirene/sirene-stock-unite-legale.adapter";
import SireneStockUniteLegaleCli from "../../../src/adapters/inputs/cli/sirene-stock-unite-legale.cli";
import { ObjectId } from "mongodb";
import uniteLegalNameAdapter from "../../../src/adapters/outputs/db/unite-legale-name/unite-legale-name.adapter";
import uniteLegaleEntrepriseAdapter from "../../../src/adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.adapter";
import sireneUniteLegaleAdapter from "../../../src/adapters/outputs/db/sirene/sirene-unite-legale.adapter";

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
            const data = (await sireneUniteLegaleAdapter.collection.find({}).toArray()).map(object => ({
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
            const data = (await uniteLegaleEntrepriseAdapter.collection.find({}).toArray()).map(object => ({
                ...object,
                _id: expect.any(ObjectId),
            }));
            expect(data).toMatchSnapshot();
        });
    });
});
