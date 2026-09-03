import { SireneStockUniteLegaleService } from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import { SireneStockCron } from "./sirene-stock.cron";
import * as DateHelper from "../../../shared/helpers/DateHelper";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";

jest.mock("../../../shared/helpers/DateHelper");
jest.mock("../../../modules/providers/sirene/sirene-stock-unite-legale.service", () => ({ getAndParse: jest.fn() }));

describe("SireneStockCron", () => {
    const EXPORT_DATE = "2026-07-20";

    const mockULPipeline = {
        getAndParse: jest.fn(),
    } as unknown as SireneStockUniteLegaleService;
    const mockEstabPipeline = {
        run: jest.fn(),
    } as unknown as DownloadAndImport;

    const cron = new SireneStockCron(mockULPipeline, mockEstabPipeline);

    jest.spyOn(DateHelper, "formatDateToYYYYMMDDWithSeparator").mockReturnValue(EXPORT_DATE);

    describe("import", () => {
        let mockImportEstabs: jest.SpyInstance, mockImportUL: jest.SpyInstance;

        beforeAll(() => {
            mockImportEstabs = jest.spyOn(cron, "importEstablishments").mockResolvedValue();
            mockImportUL = jest.spyOn(cron, "importUnitesLegale").mockResolvedValue();
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

    describe("importUnitesLegale", () => {
        it("gets and parse file", async () => {
            await cron.importUnitesLegale();
            expect(mockULPipeline.getAndParse).toHaveBeenCalled();
        });
    });

    describe("importEstablishments", () => {
        it("runs download and import pipeline", async () => {
            await cron.importEstablishments();
            expect(mockEstabPipeline.run).toHaveBeenCalled();
        });
    });
});
