import uniteLegalFilesService from "./uniteLegal.files.service";
import datagouvFilesService from "../datagouv.files.service";

jest.mock("../datagouv.files.service");

describe("FilesUniteLegalService", () => {
    describe("decompressHistoryUniteLegal", () => {
        const OUT_PATH = "./output/StockUniteLegaleHistorique_utf8.csv";
        const ARCHIVE_PATH = "Fake/path";

        it("calls datagouv.decompressArchive", async () => {
            await uniteLegalFilesService.decompressHistoryUniteLegal(ARCHIVE_PATH);

            expect(datagouvFilesService.decompressArchive).toHaveBeenCalledWith(ARCHIVE_PATH, OUT_PATH);
        });

        it("returns result from datagouv.decompressArchive", async () => {
            const RES = "RES";
            const expected = RES;
            jest.mocked(datagouvFilesService.decompressArchive).mockResolvedValueOnce(RES);
            const actual = await uniteLegalFilesService.decompressHistoryUniteLegal(ARCHIVE_PATH);

            expect(actual).toBe(expected);
        });
    });

    describe("downloadHistoryUniteLegal", () => {
        it("calls datagouv.downloadFile", async () => {
            await uniteLegalFilesService.downloadHistoryUniteLegal();

            expect(datagouvFilesService.downloadFile).toHaveBeenCalledWith(
                "https://files.data.gouv.fr/insee-sirene/StockUniteLegaleHistorique_utf8.zip",
                "StockUniteLegaleHistorique_utf8.zip",
            );
        });

        it("returns result from datagouv.decompressArchive", async () => {
            const RES = "RES";
            const expected = RES;
            jest.mocked(datagouvFilesService.downloadFile).mockResolvedValueOnce(RES);
            const actual = await uniteLegalFilesService.downloadHistoryUniteLegal();

            expect(actual).toBe(expected);
        });
    });
});
