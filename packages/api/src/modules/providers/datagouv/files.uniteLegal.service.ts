import fs from "fs";
import https from "https";
import { exec } from "child_process";

export class FilesUniteLegalService {
    decompressHistoryUniteLegal(archivePath: string): Promise<string> {
        return new Promise(resolve => {
            console.log("Start decompress");
            exec(`unzip ${archivePath} -d ./output`, async () => {
                console.log("End decompress");
                resolve("./output/StockUniteLegaleHistorique_utf8.csv");
            });
        });
    }

    downloadHistoryUniteLegal(): Promise<string> {
        return new Promise(resolve => {
            console.log("Start Download");
            const file = fs.createWriteStream("StockUniteLegaleHistorique_utf8.zip");
            https.get("https://files.data.gouv.fr/insee-sirene/StockUniteLegaleHistorique_utf8.zip", response => {
                response.pipe(file).on("finish", () => {
                    console.log("End download");
                    file.close();
                    resolve("StockUniteLegaleHistorique_utf8.zip");
                });
            });
        });
    }
}

const filesUniteLegalService = new FilesUniteLegalService();

export default filesUniteLegalService;
