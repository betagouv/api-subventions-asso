import fs from 'fs';
import { GenericParser } from "../../../../../shared/GenericParser";
import { asyncForEach } from "../../../../../shared/helpers/ArrayHelper";
import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import sireneStockUniteLegaleService from "../sireneStockUniteLegale.service";
import SireneStockUniteLegaleAdapter from "../adapter/sireneStockUniteLegale.adapter";
import Siren from "../../../../../valueObjects/Siren";
import csv from 'csv-parser';
import { SireneStockUniteLegaleEntity } from "../../../../../entities/SireneStockUniteLegaleEntity";

export class SireneStockUniteLegaleParser{

    static async parseCsvAndInsert(filePath: string) : Promise<void> {
        this.filePathValidator(filePath);

        console.info("\nStart parsing file: ", filePath);

        return new Promise((resolve, reject) => {
            let currentRow = 0;
            let header: null | string[] = null;
            
            const interval = setInterval(() => {
                console.info(`Downloading: ${currentRow}`);
            }, 5000);

            let batch : SireneStockUniteLegaleEntity[] = [];
            const stream = fs.createReadStream(filePath);

            stream
            .pipe(csv())
            .on('data', async (data) => {
                if (this.isToInclude(data)) {
                    currentRow++;
                    const entity = SireneStockUniteLegaleAdapter.dtoToEntity(data);
                    batch.push(entity);
                    if(batch.length >= 1000) {
                        await sireneStockUniteLegaleService.insertMany(batch.map(entity => SireneStockUniteLegaleAdapter.entityToDbo(entity)));
                        batch = [];
                    }
                }
            })
            .on('end', () => {
                console.info("Finished parsing file.");
                resolve(); 
            })
            .on('error', (error) => {
                console.error("Error reading CSV file:", error);
                reject(error);
            });
        });

    };

    static async parseCsv(filePath)   {
        this.filePathValidator(filePath);
        console.info("\nStart parsing file: ", filePath);
        console.log('dirrentSiren')
        return new Promise((resolve, reject) => {
            const results  = [];
            let currentRow = 0;
            const interval = setInterval(() => {
                console.info(`Downloading: ${currentRow}`);
            }, 5000);
            
            
            
            fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {    
                //@ts-ignore
                currentRow++;
             //   results.push(data); // Only include if it meets the criteria
            
            })
            .on('end', () => {
                console.info("Finished parsing file.");
                resolve(results); // Resolve with the filtered results
            })
            .on('error', (error) => {
                console.error("Error reading CSV file:", error);
                reject(error);
            });
        });
    }

    protected static filePathValidator(file: string) {
        if (!file) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }
        return true;
    }

    static isToInclude(data : SireneUniteLegaleDto) {
        const categorieJuridique = data.categorieJuridiqueUniteLegale;
        const unitePurgee = data.unitePurgeeUniteLegale;

        return ((LEGAL_CATEGORIES_ACCEPTED.includes(categorieJuridique) && 
        unitePurgee == "" && (Siren.isSiren(data.siren))));
    }

}
