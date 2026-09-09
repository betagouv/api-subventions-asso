import * as fs from "fs";
import path from "path";
import { Readable } from "stream";
import sireneUniteLegaleService from "./sirene-unite-legale.service";
import { RequestResponse } from "../../provider-request/@types/RequestResponse";
import { sireneStockUniteLegaleAdapter } from "../../../adapters/outputs/api/data-gouv/data-gouv.adapter";

const SIRENE_STOCK_UNITE_LEGALE_FILE_NAME = "sirene-stock-unite-legale.parquet";

export class SireneStockUniteLegaleService {
    private directory_path;

    private getOrCreateDirectory() {
        // do not remove this as it is at least used in integration tests
        // this would be easier to test with DI and use cases
        if (this.directory_path && fs.existsSync(path.join(__dirname, this.directory_path))) {
            // joining __dirname only works if it is called only once and directory_path does not already contain __dirname
            this.directory_path = path.join(__dirname, this.directory_path);
        } else {
            this.directory_path = fs.mkdtempSync(__dirname + "/tmpSirene");
        }
    }

    public async getAndParse() {
        await this.getAndSaveFile();
        await sireneUniteLegaleService.parse(path.join(this.directory_path, SIRENE_STOCK_UNITE_LEGALE_FILE_NAME));
        this.deleteTemporaryFolder();
    }

    public async getAndSaveFile() {
        this.getOrCreateDirectory();
        await this.getAndSaveParquet();
    }

    public async getAndSaveParquet() {
        const writeFile = fs.createWriteStream(path.join(this.directory_path, SIRENE_STOCK_UNITE_LEGALE_FILE_NAME));
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

    public deleteTemporaryFolder() {
        fs.rmSync(this.directory_path, { recursive: true });
    }
}

const sireneStockUniteLegaleService = new SireneStockUniteLegaleService();
export default sireneStockUniteLegaleService;
