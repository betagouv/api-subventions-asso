import db from "../../../../src/shared/MongoConnection";
import fs from "fs";
import path from "path";
import axios from "axios";
import sireneStockUniteLegaleFileService from "../../../../src/modules/providers/sirene/sirene-stock-unite-legale.service";
import sireneStockCron from "../../../../src/adapters/inputs/cron/sirene-stock.cron";

jest.mock("axios");

describe("Sriene stock CRON", () => {
    describe("import", () => {
        let mockImportEstablishment: jest.SpyInstance;
        let mockImportUnitesLegale: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error: mock
            mockImportEstablishment = jest.spyOn(sireneStockCron, "importEstablishments").mockResolvedValue();
            // @ts-expect-error: mock
            mockImportUnitesLegale = jest.spyOn(sireneStockCron, "importUnitesLegale").mockResolvedValue();
        });

        afterAll(() => {
            [mockImportEstablishment, mockImportUnitesLegale].forEach(mock => mock.mockRestore());
        });

        it("imports unites legale", async () => {
            await sireneStockCron.import();
            expect(mockImportUnitesLegale).toHaveBeenCalled();
        });

        it("imports establishment", async () => {
            await sireneStockCron.import();
            expect(mockImportEstablishment).toHaveBeenCalled();
        });
    });

    describe.only("importUnitesLegale", () => {
        const fixtureStream = fs.createReadStream(
            path.join(__dirname, "../__fixtures__", "remote.sirene-stock-unite-legale.zip"),
        );

        beforeAll(() => {
            jest.mocked(axios.request).mockResolvedValue({
                data: fixtureStream,
                status: 200,
                headers: {},
            });
        });

        it("imports data", async () => {
            // @ts-expect-error: modify private property
            sireneStockUniteLegaleFileService.directory_path = "../../../../tests/adapters/inputs/__fixtures__";

            // @ts-expect-error: modify private property
            console.log(sireneStockUniteLegaleFileService.directory_path);
            // @ts-expect-error: private method
            await sireneStockCron.importUnitesLegale();
            const dbos = await db.collection("sirene").find({}).toArray();
            expect(dbos).toMatchSnapshot();
        });
    });

    describe("importEstablishments", () => {
        const fixtureStream = fs.createReadStream(
            path.join(__dirname, "../__fixtures__", "sirene-establishment.parquet"),
        );

        beforeAll(() => {
            jest.mocked(axios.request).mockResolvedValue({
                data: fixtureStream,
                status: 200,
                headers: {},
            });
        });

        it("imports data", async () => {
            // fixture only got lines with siren 100000000
            await db.collection("sirene").insertOne({ siren: "100000000" });
            // @ts-expect-error: private method
            await sireneStockCron.importEstablishments();
            const dbos = await db.collection("etablissement").find({}).toArray();
            expect(dbos).toMatchSnapshot();
        });
    });
});
