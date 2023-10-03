import fs from "fs";
import https from "https";

export default function DownloadHistoryUniteeLegalUseCase(): Promise<string> {
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
