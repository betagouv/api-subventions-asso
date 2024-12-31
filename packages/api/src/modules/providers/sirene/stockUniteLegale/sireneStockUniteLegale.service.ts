import * as fs from "fs";
import { exec } from "child_process";
import { SireneUniteLegaleDbo } from "./@types/SireneUniteLegaleDbo";
import sireneUniteLegaleDbPort from "../../../../dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import sireneStockUniteLegaleApiPort from "../../../../dataProviders/api/sirene/sireneStockUniteLegale.port";
import { SireneStockUniteLegaleParser } from "./parser/sireneStockUniteLegale.parser";

export class SireneStockUniteLegaleService {
    directory_path = fs.mkdtempSync(__dirname +"/tmpSirene");
    
    public async getAndParse(){
        await this.getExtractAndSaveFiles();
        await SireneStockUniteLegaleParser.parseCsvAndInsert(this.directory_path + "/StockUniteLegale_utf8.csv");
        this.deleteTemporaryFolder;
    }


    public async getExtractAndSaveFiles() {
        await this.getAndSaveZip();
        const zipPath = this.directory_path + "/SireneStockUniteLegale.zip";
        await this.decompressFolder(zipPath, this.directory_path);
    }

    public async getAndSaveZip() {
        const file = fs.createWriteStream(this.directory_path+ "/SireneStockUniteLegale.zip");
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

    public decompressFolder(zipPath: string, destinationDirectoryPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            console.log("Start decompress");
            exec(`unzip ${zipPath} -d ${destinationDirectoryPath}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error decompressing archive: ${stderr}`);
                    reject(`Failed to decompress: ${stderr}`);
                    return;
                }
                console.log("End decompress");
                resolve(destinationDirectoryPath);
            });
        });
    }

    public async insertOne(dbo : SireneUniteLegaleDbo) {
        return sireneUniteLegaleDbPort.insertOne(dbo);
    }

    public async deleteTemporaryFolder() {
        fs.rmdirSync(this.directory_path, { recursive: true });
    }
}

const sireneStockUniteLegaleService = new SireneStockUniteLegaleService();
export default sireneStockUniteLegaleService;
