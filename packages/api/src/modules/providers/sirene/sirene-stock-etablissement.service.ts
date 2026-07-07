import * as fs from "fs";
import sireneEtablissementService from "./sirene-etablissement.service";
import sireneStockEtablissementAdapter from "../../../adapters/outputs/api/sirene/sirene-stock-etablissement.adapter";

export class SireneStockEtablissementService {
    private directory_path = "";

    private getOrCreateDirectory() {
        if (!this.directory_path || !fs.existsSync(this.directory_path)) {
            this.directory_path = fs.mkdtempSync(__dirname + "/tmpSireneEtablissements");
        }
    }

    public async getAndParse() {
        try {
            await this.getExtractAndSaveFiles();
            await sireneEtablissementService.parse(this.directory_path + "/sirene-stock-etablissement.parquet");
        } finally {
            this.deleteTemporaryFolder();
        }
    }

    public async getExtractAndSaveFiles() {
        this.getOrCreateDirectory();
        await this.getAndSaveParquet();
    }

    public async getAndSaveParquet() {
        const file = fs.createWriteStream(this.directory_path + "/sirene-stock-etablissement.parquet");
        const response = await sireneStockEtablissementAdapter.getParquet();

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

    public deleteTemporaryFolder() {
        if (this.directory_path && fs.existsSync(this.directory_path)) {
            fs.rmSync(this.directory_path, { recursive: true });
        }
        this.directory_path = "";
    }
}

const sireneStockEtablissementFileService = new SireneStockEtablissementService();
export default sireneStockEtablissementFileService;
