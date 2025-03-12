import path from "path";
import fs from "fs";
import sireneStockUniteLegaleApiPort from "../../../src/dataProviders/api/sirene/sireneStockUniteLegale.port";
import sireneStockUniteLegaleDbPort from "../../../src/dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import SireneStockUniteLegaleCli from "../../../src/interfaces/cli/SireneStockUniteLegale.cli";
import { ObjectId } from "mongodb";

let ZIP_PATH = path.resolve(__dirname, "../../../src/modules/providers/sirene/__fixtures__");

describe("SireneStockUniteLegaleCli", () => {
    let getZipMock: jest.SpyInstance;
    beforeAll(() => {
        const zipStream = fs.createReadStream(ZIP_PATH + "/StockUniteLegale_utf8.zip");
        getZipMock = jest.spyOn(sireneStockUniteLegaleApiPort, "getZip").mockResolvedValue({
            data: zipStream,
            status: 200,
            statusText: "OK",
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    let cli = new SireneStockUniteLegaleCli();
    describe("parse", () => {
        it("should persist sirene data", async () => {
            await cli.getAndParse();
            // @ts-expect-error: access protected for test
            const data = (await sireneStockUniteLegaleDbPort.collection.find({}).toArray()).map(object => ({
                ...object,
                _id: expect.any(ObjectId),
            }));
            // TODO check sirene

            expect(data).toMatchSnapshot();
        });
    });
});
