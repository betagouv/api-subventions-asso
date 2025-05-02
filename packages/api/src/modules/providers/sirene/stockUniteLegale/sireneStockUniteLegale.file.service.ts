import * as fs from "fs";
import StreamZip from "node-stream-zip";
import sireneStockUniteLegaleApiPort from "../../../../dataProviders/api/sirene/sireneStockUniteLegale.port";
import sireneStockUniteLegaleService from "./sireneStockUniteLegale.service";

export class SireneStockUniteLegaleFileService {
    private directory_path;

    private getOrCreateDirectory() {
        if (!fs.existsSync(this.directory_path)) {
            this.directory_path = fs.mkdtempSync(__dirname + "/tmpSirene");
        }
    }

    public async getAndParse() {
        await this.getExtractAndSaveFiles();
        console.log("start getExtractAndSaveFiles");
        await sireneStockUniteLegaleService.parse(this.directory_path + "/StockUniteLegale_utf8.csv");
        this.deleteTemporaryFolder();
    }

    public async getExtractAndSaveFiles() {
        this.getOrCreateDirectory();
        await this.getAndSaveZip();
        const zipPath = this.directory_path + "/SireneStockUniteLegale.zip";
        await this.decompressFolder(zipPath, this.directory_path);
    }

    public async getAndSaveZip() {
        const file = fs.createWriteStream(this.directory_path + "/SireneStockUniteLegale.zip");
        const response = await sireneStockUniteLegaleApiPort.getZip();

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
            let hasErrorOccured = false;
            response.data.on("error", error => {
                clearInterval(interval);
                hasErrorOccured = true;
                console.log("error", error);
                file.close();
                reject(error);
            });

            file.on("finish", () => {
                if (hasErrorOccured) {
                    return;
                }
                clearInterval(interval);
                console.log("finish");
                resolve("finish");
            });

            file.on("error", error => {
                clearInterval(interval);
                console.log("error", error);
                file.close();
                reject(error);
            });
        });
    }

    public async decompressFolder(zipPath: string, destinationDirectoryPath: string) {
        console.log("Start decompress");
        try {
            const zip = new StreamZip.async({ file: zipPath });
            await zip.extract(null, destinationDirectoryPath);
            await zip.close();
            console.log("End decompress");
        } catch (error) {
            console.error(`Error decompressing archive: ${error}`);
        }
    }

    public deleteTemporaryFolder() {
        fs.rmSync(this.directory_path, { recursive: true });
    }
}

const sireneStockUniteLegaleFileService = new SireneStockUniteLegaleFileService();
export default sireneStockUniteLegaleFileService;
