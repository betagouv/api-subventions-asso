import path from "path";
import fs from "fs";
import sireneStockUniteLegaleApiPort from "../../../src/dataProviders/api/sirene/sireneStockUniteLegale.port";
import sireneStockUniteLegaleDbPort from "../../../src/dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import SireneStockUniteLegaleCli from "../../../src/interfaces/cli/SireneStockUniteLegale.cli";
import { ObjectId } from "mongodb";
import uniteLegalNamePort from "../../../src/dataProviders/db/uniteLegalName/uniteLegalName.port";
import uniteLegalEntreprisePort from "../../../src/dataProviders/db/uniteLegalEntreprise/uniteLegalEntreprise.port";

const ZIP_PATH = path.resolve(__dirname, "../../../src/modules/providers/sirene/__fixtures__");

describe("SireneStockUniteLegaleCli", () => {
    beforeAll(() => {
        jest.spyOn(sireneStockUniteLegaleApiPort, "getZip").mockImplementation(() =>
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
            const data = (await sireneStockUniteLegaleDbPort.collection.find({}).toArray()).map(object => ({
                ...object,
                _id: expect.any(ObjectId),
            }));
            expect(data).toMatchSnapshot();
        });

        it("should persist asso names", async () => {
            await cli.import();
            // @ts-expect-error: access protected for test
            const data = (await uniteLegalNamePort.collection.find({}).toArray()).map(object => ({
                ...object,
                _id: expect.any(ObjectId),
            }));
            expect(data).toMatchSnapshot();
        });

        it("should persist entreprises' siret", async () => {
            await cli.import();
            // @ts-expect-error: access protected for test
            const data = (await uniteLegalEntreprisePort.collection.find({}).toArray()).map(object => ({
                ...object,
                _id: expect.any(ObjectId),
            }));
            expect(data).toMatchSnapshot();
        });
    });
});
