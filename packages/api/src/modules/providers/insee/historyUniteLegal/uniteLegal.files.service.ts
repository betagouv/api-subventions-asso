import inseeFilesService from "../insee.files.service";
import { downloadFile } from "../../../../shared/helpers/FileHelper";

export class UniteLegalFilesService {
    decompressHistoryUniteLegal(archivePath: string): Promise<string> {
        return inseeFilesService.decompressArchive(archivePath, "./output/StockUniteLegaleHistorique_utf8.csv");
    }

    downloadHistoryUniteLegal(): Promise<string> {
        return downloadFile(
            "https://files.data.gouv.fr/insee-sirene/StockUniteLegaleHistorique_utf8.zip",
            "output/StockUniteLegaleHistorique_utf8.zip",
        );
    }
}

const uniteLegalFilesService = new UniteLegalFilesService();

export default uniteLegalFilesService;
