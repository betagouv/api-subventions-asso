import * as fs from "fs";
import path from "path";
import { Readable } from "stream";
import StreamZip from "node-stream-zip";
import sireneUniteLegaleService from "./sirene-unite-legale.service";
import { RequestResponse } from "../../provider-request/@types/RequestResponse";
import { sireneStockUniteLegaleAdapter } from "../../../adapters/outputs/api/data-gouv/data-gouv.adapter";
import { ENV } from "../../../configurations/env.conf";

export class SireneStockUniteLegaleService {
    private directory_path;

    private getOrCreateDirectory() {
        const absolutePath = path.join(__dirname, this.directory_path);
        console.log("absolutePath", absolutePath, fs.existsSync(absolutePath));
        if (fs.existsSync(absolutePath)) {
            this.directory_path = absolutePath;
            console.log("setting directory path to : ", this.directory_path);
        } else {
            this.directory_path = fs.mkdtempSync(__dirname + "/tmpSirene");
        }
    }

    public async getAndParse() {
        await this.getExtractAndSaveFiles();
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
        const readFile = (await sireneStockUniteLegaleAdapter.getFileStream()) as RequestResponse<Readable>;

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
        console.log("ZIP PATH", zipPath, destinationDirectoryPath);
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
        if (!["dev", "test"].includes(ENV)) fs.rmSync(this.directory_path, { recursive: true });
    }
}

const sireneStockUniteLegaleFileService = new SireneStockUniteLegaleService();
export default sireneStockUniteLegaleFileService;
