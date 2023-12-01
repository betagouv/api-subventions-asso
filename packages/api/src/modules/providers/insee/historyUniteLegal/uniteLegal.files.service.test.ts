import uniteLegalFilesService from "./uniteLegal.files.service";
import inseeFilesService from "../insee.files.service";
import { downloadFile } from "../../../../shared/helpers/FileHelper";

jest.mock("../insee.files.service");
jest.mock("../../../../shared/helpers/FileHelper");

describe("FilesUniteLegalService", () => {
    describe("decompressHistoryUniteLegal", () => {
        const OUT_PATH = "./output/StockUniteLegaleHistorique_utf8.csv";
        const ARCHIVE_PATH = "Fake/path";

        it("calls insee.decompressArchive", async () => {
            await uniteLegalFilesService.decompressHistoryUniteLegal(ARCHIVE_PATH);

            expect(inseeFilesService.decompressArchive).toHaveBeenCalledWith(ARCHIVE_PATH, OUT_PATH);
        });

        it("returns result from insee.decompressArchive", async () => {
            const RES = "RES";
            const expected = RES;
            jest.mocked(inseeFilesService.decompressArchive).mockResolvedValueOnce(RES);
            const actual = await uniteLegalFilesService.decompressHistoryUniteLegal(ARCHIVE_PATH);

            expect(actual).toBe(expected);
        });
    });

    describe("downloadHistoryUniteLegal", () => {
        it("calls insee.downloadFile", async () => {
            await uniteLegalFilesService.downloadHistoryUniteLegal();

            expect(downloadFile).toHaveBeenCalledWith(
                "https://files.data.gouv.fr/insee-sirene/StockUniteLegaleHistorique_utf8.zip",
                "StockUniteLegaleHistorique_utf8.zip",
            );
        });

        it("returns result from insee.decompressArchive", async () => {
            const RES = "RES";
            const expected = RES;
            jest.mocked(downloadFile).mockResolvedValueOnce(RES);
            const actual = await uniteLegalFilesService.downloadHistoryUniteLegal();

            expect(actual).toBe(expected);
        });
    });
});
