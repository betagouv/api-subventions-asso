import sireneStockUniteLegaleFileService from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import { SireneStockCron } from "./sirene-stock.cron";
import * as DateHelper from "../../../shared/helpers/DateHelper";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";

jest.mock("../../../shared/helpers/DateHelper");
jest.mock("../../../modules/providers/sirene/sirene-stock-unite-legale.service", () => ({ getAndParse: jest.fn() }));

describe("SireneStockCron", () => {
    const EXPORT_DATE = "2026-07-20";
    // const mockCli = { parse: jest.fn() } as unknown as EstablishmentCli;
    // const mockDownload = { execute: jest.fn().mockResolvedValue({ filePath: FILE_PATH }) } as unknown as DownloadFile;
    // const mockRemove = { execute: jest.fn() } as unknown as RemoveFile;
    const mockPipeline = {
        run: jest.fn(),
    } as unknown as DownloadAndImport;

    const cron = new SireneStockCron(mockPipeline);

    jest.spyOn(DateHelper, "formatDateToYYYYMMDDWithSeparator").mockReturnValue(EXPORT_DATE);

    describe("import", () => {
        let mockImportEstabs: jest.SpyInstance, mockImportUL: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: mock private method
            mockImportEstabs = jest.spyOn(cron, "importEstablishments").mockResolvedValue();
            // @ts-expect-error: mock private method
            mockImportUL = jest.spyOn(cron, "importUniteLegales").mockResolvedValue();
        });

        afterAll(() => [mockImportEstabs, mockImportUL].forEach(mock => mock.mockRestore()));

        it("imports unite legale", async () => {
            await cron.import();
            expect(mockImportUL).toHaveBeenCalled();
        });

        it("imports establishments", async () => {
            await cron.import();
            expect(mockImportEstabs).toHaveBeenCalled();
        });
    });

    describe("importUniteLegales", () => {
        it("gets and parse file", async () => {
            // @ts-expect-error: test private method
            await cron.importUniteLegales();
            expect(sireneStockUniteLegaleFileService.getAndParse).toHaveBeenCalled();
        });
    });

    describe("importEstablishments", () => {
        it("runs download and import pipeline", async () => {
            // @ts-expect-error: test private method
            await cron.importEstablishments();
            expect(mockPipeline.run).toHaveBeenCalled();
        });
    });
});
