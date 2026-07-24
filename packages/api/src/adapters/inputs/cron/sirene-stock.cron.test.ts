import sireneStockUniteLegaleFileService from "../../../modules/providers/sirene/sirene-stock-unite-legale.service";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import EstablishmentCli from "../cli/establishment.cli";
import { SireneStockCron } from "./sirene-stock.cron";
import * as DateHelper from "../../../shared/helpers/DateHelper";

jest.mock("../../../shared/helpers/DateHelper");
jest.mock("../../../modules/providers/sirene/sirene-stock-unite-legale.service", () => ({ getAndParse: jest.fn() }));

describe("SireneStockCron", () => {
    const FILE_PATH = "/path/to/file";
    const EXPORT_DATE = "2026-07-20";
    const mockCli = { parse: jest.fn() } as unknown as EstablishmentCli;
    const mockDownload = { execute: jest.fn().mockResolvedValue({ filePath: FILE_PATH }) } as unknown as DownloadFile;
    const mockRemove = { execute: jest.fn() } as unknown as RemoveFile;

    const cron = new SireneStockCron(mockCli, mockDownload, mockRemove);

    jest.spyOn(DateHelper, "formatDateToYYYYMMDDWithSeparator").mockReturnValue(EXPORT_DATE);

    it("imports unite legale", async () => {
        await cron.import();
        expect(sireneStockUniteLegaleFileService.getAndParse).toHaveBeenCalled();
    });

    it("downloads establishments file", async () => {
        await cron.import();
        expect(mockDownload.execute).toHaveBeenCalled();
    });

    it("imports establishments", async () => {
        await cron.import();
        expect(mockCli.parse).toHaveBeenCalledWith(FILE_PATH, EXPORT_DATE);
    });

    it("remove temporary file", async () => {
        await cron.import();
        expect(mockRemove.execute).toHaveBeenCalledWith(FILE_PATH);
    });
});
