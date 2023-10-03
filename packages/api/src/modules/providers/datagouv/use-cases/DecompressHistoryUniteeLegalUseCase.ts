import { exec } from "child_process";

export default function DecompressHistoryUniteeLegalUseCase(archivePath: string): Promise<string> {
    return new Promise(resolve => {
        console.log("Start decompress");
        exec(`unzip ${archivePath} -d ./output`, async () => {
            console.log("End decompress");
            resolve("./output/StockUniteLegaleHistorique_utf8.csv");
        });
    });
}
