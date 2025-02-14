import fs from "fs";

import { parse } from "csv-parse";
import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import sireneStockUniteLegaleService from "../sireneStockUniteLegale.service";
import SireneStockUniteLegaleAdapter from "../adapter/sireneStockUniteLegale.adapter";
import Siren from "../../../../../valueObjects/Siren";
import { SireneStockUniteLegaleEntity } from "../../../../../entities/SireneStockUniteLegaleEntity";

export default class SireneStockUniteLegaleParser {
    static async parseCsvAndInsert(filePath: string): Promise<void> {
        this.filePathValidator(filePath);

        console.info("\nStart parsing file: ", filePath);

        return new Promise((resolve, reject) => {
            let currentRow = 0;
            const header: null | string[] = null;

            const interval = setInterval(() => {
                console.info(`Downloading: ${currentRow}`);
            }, 5000);

            let batch: SireneStockUniteLegaleEntity[] = [];
            let batchToSave: SireneStockUniteLegaleEntity[] = [];
            const stream = fs.createReadStream(filePath);

            stream
                .pipe(parse({ columns: true }))
                .on("data", async data => {
                    if (this.isToInclude(data)) {
                        currentRow++;
                        const entity = SireneStockUniteLegaleAdapter.dtoToEntity(data);
                        batch.push(entity);
                        stream.pause();
                        if (batch.length === 1000) {
                            batchToSave = batch;
                            batch = [];
                            await sireneStockUniteLegaleService.insertMany(
                                batchToSave.map(entity => SireneStockUniteLegaleAdapter.entityToDbo(entity)),
                            );
                        }
                        stream.resume();
                    }
                })
                .on("end", async () => {
                    clearInterval(interval);

                    if (batch.length > 0) {
                        await sireneStockUniteLegaleService.insertMany(
                            batch.map(entity => SireneStockUniteLegaleAdapter.entityToDbo(entity)),
                        );
                    }

                    console.info("Finished parsing file.");
                    resolve();
                })
                .on("error", error => {
                    clearInterval(interval);
                    console.error("Error reading CSV file:", error);
                    reject(error);
                });
        });
    }

    static filePathValidator(file: string) {
        if (!file) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }
        return true;
    }

    static isToInclude(data: SireneUniteLegaleDto) {
        const categorieJuridique = data.categorieJuridiqueUniteLegale;
        const unitePurgee = data.unitePurgeeUniteLegale;
        /* for storage reasons, data concerning companies
            ceased before 31/12/2002 are purged.
            * unitePurgee == true if the company has been purged
            * unitePurgee == "" if the company has not been purged
        */

        return LEGAL_CATEGORIES_ACCEPTED.includes(categorieJuridique) && unitePurgee == "" && Siren.isSiren(data.siren);
    }
}
