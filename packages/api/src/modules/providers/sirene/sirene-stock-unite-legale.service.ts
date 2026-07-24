import * as fs from "fs";
import { Readable } from "stream";
import StreamZip from "node-stream-zip";
import sireneUniteLegaleService from "./sirene-unite-legale.service";
import sireneStockUniteLegaleAdapter from "../../../adapters/outputs/api/sirene/sirene-stock-unite-legale.adapter";
import { RequestResponse } from "../../provider-request/@types/RequestResponse";

export class SireneStockUniteLegaleService {
    private directory_path;

    private getOrCreateDirectory() {
        if (!fs.existsSync(this.directory_path)) {
            this.directory_path = fs.mkdtempSync(__dirname + "/tmpSirene");
        }
    }

    public async getAndParse() {
        await this.getExtractAndSaveFiles();
        console.log("start getExtractAndSaveFiles");
        await sireneUniteLegaleService.parse(this.directory_path + "/StockUniteLegale_utf8.csv");
        this.deleteTemporaryFolder();
    }

    public async getExtractAndSaveFiles() {
        this.getOrCreateDirectory();
        await this.getAndSaveZip();
        const zipPath = this.directory_path + "/sirene-stock-unite-legale.zip";
        await this.decompressFolder(zipPath, this.directory_path);
    }

    public async getAndSaveZip() {
        const writeFile = fs.createWriteStream(this.directory_path + "/sirene-stock-unite-legale.zip");
        const readFile = (await sireneStockUniteLegaleAdapter.getZip()) as RequestResponse<Readable>;

        console.info(`Start downloading the file`);

        return new Promise<string>((resolve, reject) => {
            readFile.data.pipe(writeFile);

            let currentLength = 0;
            const interval = setInterval(() => {
                console.info(`Downloading: ${(currentLength / 1_000_000).toFixed(2)} MB`);
            }, 5000);

            readFile.data.on("data", chunk => {
                currentLength += chunk.length;
            });
            let hasErrorOccured = false;

            readFile.data.on("error", error => {
                clearInterval(interval);
                hasErrorOccured = true;
                console.log("error", error);
                writeFile.close();
                reject(error);
            });

            writeFile.on("finish", () => {
                if (hasErrorOccured) {
                    return;
                }
                clearInterval(interval);
                console.log("finish");
                resolve("finish");
            });

            writeFile.on("error", error => {
                clearInterval(interval);
                console.log("error", error);
                writeFile.close();
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

const sireneStockUniteLegaleFileService = new SireneStockUniteLegaleService();
export default sireneStockUniteLegaleFileService;
