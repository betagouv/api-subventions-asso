import datagouvFilesService from "../datagouv.files.service";

export class UniteLegalFilesService {
    decompressHistoryUniteLegal(archivePath: string): Promise<string> {
        return datagouvFilesService.decompressArchive(archivePath, "./output/StockUniteLegaleHistorique_utf8.csv");
    }

    downloadHistoryUniteLegal(): Promise<string> {
        return datagouvFilesService.downloadFile(
            "https://files.data.gouv.fr/insee-sirene/StockUniteLegaleHistorique_utf8.zip",
            "StockUniteLegaleHistorique_utf8.zip",
        );
    }
}

const uniteLegalFilesService = new UniteLegalFilesService();

export default uniteLegalFilesService;
