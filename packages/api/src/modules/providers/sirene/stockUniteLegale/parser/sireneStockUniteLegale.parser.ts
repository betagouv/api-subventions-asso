import fs from "fs";

import { parse } from "csv-parse";
import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import sireneStockUniteLegaleService from "../sireneStockUniteLegale.service";
import SireneStockUniteLegaleAdapter from "../adapter/sireneStockUniteLegale.adapter";
import Siren from "../../../../../valueObjects/Siren";
import { SireneStockUniteLegaleEntity } from "../../../../../entities/SireneStockUniteLegaleEntity";
import { UniteLegalEntrepriseEntity } from "../../../../../entities/UniteLegalEntrepriseEntity";
import uniteLegalEntreprisesService from "../../../uniteLegalEntreprises/uniteLegal.entreprises.service";

export default class SireneStockUniteLegaleParser {
    static async parseCsvAndInsert(filePath: string): Promise<void> {
        this.filePathValidator(filePath);

        console.info("\nStart parsing file: ", filePath);

        return new Promise((resolve, reject) => {
            let currentRow = 0;

            const interval = setInterval(() => {
                console.info(`Downloading: row ${currentRow}`);
            }, 5000);

            // we have to separate the batch being built and the batch to save, in order to not mess up with the stream
            // otherwise duplicate try to get saved
            let batchAssos: SireneStockUniteLegaleEntity[] = [];
            let batchAssosToSave: SireneStockUniteLegaleEntity[] = [];
            let batchNonAssos: UniteLegalEntrepriseEntity[] = [];
            let batchNonAssosToSave: UniteLegalEntrepriseEntity[] = [];
            const stream = fs.createReadStream(filePath);

            stream
                .pipe(parse({ columns: true }))
                .on("data", async data => {
                    currentRow++;
                    if (!this.isCorrect(data)) return;
                    stream.pause();
                    if (this.isAsso(data)) {
                        const entity = SireneStockUniteLegaleAdapter.dtoToEntity(data);
                        batchAssos.push(entity);
                        if (batchAssos.length === 1000) {
                            batchAssosToSave = batchAssos;
                            batchAssos = [];
                            await sireneStockUniteLegaleService.insertMany(
                                batchAssosToSave.map(entity => SireneStockUniteLegaleAdapter.entityToDbo(entity)),
                            );
                        }
                    } else {
                        const entity = new UniteLegalEntrepriseEntity(new Siren(data.siren));
                        batchNonAssos.push(entity);
                        if (batchNonAssos.length === 1000) {
                            batchNonAssosToSave = batchNonAssos;
                            batchNonAssos = [];
                            await uniteLegalEntreprisesService.insertManyEntrepriseSiren(batchNonAssosToSave);
                        }
                    }
                    stream.resume();
                })
                .on("end", async () => {
                    clearInterval(interval);

                    if (batchAssos.length > 0)
                        await sireneStockUniteLegaleService.insertMany(
                            batchAssos.map(entity => SireneStockUniteLegaleAdapter.entityToDbo(entity)),
                        );

                    if (batchNonAssos.length > 0)
                        await uniteLegalEntreprisesService.insertManyEntrepriseSiren(batchNonAssosToSave);

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
        if (!file) throw new Error("Parse command need file args");
        if (!fs.existsSync(file)) throw new Error(`File not found ${file}`);
        return true;
    }

    static isCorrect(data: SireneUniteLegaleDto) {
        const unitePurgee = data.unitePurgeeUniteLegale;
        /* for storage reasons, data concerning companies
            ceased before 31/12/2002 are purged.
            * unitePurgee == true if the company has been purged
            * unitePurgee == "" if the company has not been purged
        */

        return unitePurgee == "" && Siren.isSiren(data.siren);
    }

    static isAsso(data: SireneUniteLegaleDto) {
        const categorieJuridique = data.categorieJuridiqueUniteLegale;
        return LEGAL_CATEGORIES_ACCEPTED.includes(categorieJuridique);
    }
}
