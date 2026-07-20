import * as fs from "fs";
import { Readable } from "stream";
import { sireneStockEstablishmentAdapter } from "../../../adapters/outputs/api/data-gouv/data-gouv.adapter";
import { createEstablishmentCli } from "../../../adapters/inputs/cli/establishment.cli";
import { formatDateToYYYYMMDDWithSeparator } from "../../../shared/helpers/DateHelper";
import { RequestResponse } from "../../provider-request/@types/RequestResponse";

export class SireneStockEstablishmentService {
    private directory_path;

    private getOrCreateDirectory() {
        if (!this.directory_path || !fs.existsSync(this.directory_path)) {
            this.directory_path = fs.mkdtempSync(__dirname + "/tmpSireneEstablishment");
        }
    }

    public async getAndParse() {
        await this.getAndSaveFile();
        await createEstablishmentCli().parse(
            this.directory_path + "/StockEtablissement.parquet",
            this.getLastMonthEditionDate(),
        );
        this.deleteTemporaryFolder();
    }

    public async getAndSaveFile() {
        this.getOrCreateDirectory();

        const writeFile = fs.createWriteStream(this.directory_path + "/StockEtablissement.parquet");
        const readFile = (await sireneStockEstablishmentAdapter.getFile()) as RequestResponse<Readable>;

        console.info(`Start downloading the file`);

        return new Promise<string>((resolve, reject) => {
            readFile.data.pipe(writeFile);

            let currentLength = 0;

            const interval = setInterval(() => {
                console.info(`Downloading: ${(currentLength / 1_000_000).toFixed(2)} MB`);
            }, 5000);

            readFile.data.on("data", chunk => (currentLength += chunk.length));

            let hasErrorOccured = false;

            readFile.data.on("error", error => {
                clearInterval(interval);
                hasErrorOccured = true;
                console.log("error", error);
                writeFile.close();
                reject(error);
            });

            writeFile.on("finish", () => {
                if (hasErrorOccured) return;
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

    private getLastMonthEditionDate(): string {
        const now = new Date();
        const lastMonthLastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
        return formatDateToYYYYMMDDWithSeparator(lastMonthLastDay, "-");
    }
}

const sireneStockEstablishmentService = new SireneStockEstablishmentService();
export default sireneStockEstablishmentService;
