import * as fs from "fs";
//import StreamZip from 'node-stream-zip';
import sireneStockUniteLegalePort from "../../../../dataProviders/api/sirene/sireneStockUniteLegale.port";

const DIRECTORY_PATH = fs.mkdtempSync("./tmpSirene");

export class SireneStockUniteLegaleService {
    public async getAndSaveZip() {
        const file = fs.createWriteStream(DIRECTORY_PATH + "/SireneStockUniteLegale.zip");
        const response = await sireneStockUniteLegalePort.getZip();

        console.info(`Start downloading the file`);

        return new Promise<string>((resolve, reject) => {
            response.data.pipe(file);

            let currentLength = 0;
            const interval = setInterval(() => {
                console.info(`Downloading: ${(currentLength / 1_000_000).toFixed(2)} MB`);
            }, 5000);

            response.data.on("data", chunk => {
                currentLength += chunk.length;
            });

            response.data.on("error", error => {
                clearInterval(interval);
                file.close();
                reject(error);
                console.log("error", error);
            });

            file.on("finish", () => {
                clearInterval(interval);
                console.log("finish");
                resolve("finish");
            });

            file.on("error", error => {
                clearInterval(interval);
                console.log("error", error);
                reject(error);
            });
        });
    }
    /*
    public async unzip( zipPath: string, destinationDirectoryPath: string
    )  {
        const zip = new StreamZip.async({ file: zipPath});
        await zip.extract(null, destinationDirectoryPath);
        await zip.close();
    };
*/
}

const sireneStockUniteLegaleService = new SireneStockUniteLegaleService();
export default sireneStockUniteLegaleService;
