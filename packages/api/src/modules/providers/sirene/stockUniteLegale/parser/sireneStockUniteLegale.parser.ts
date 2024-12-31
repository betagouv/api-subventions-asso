import fs from 'fs';
import { GenericParser } from "../../../../../shared/GenericParser";
import { asyncForEach } from "../../../../../shared/helpers/ArrayHelper";
import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../../shared/LegalCategoriesAccepted";
import sireneStockUniteLegaleService from "../sireneStockUniteLegale.service";
import SireneStockUniteLegaleAdapter from "../adapter/sireneStockUniteLegale.adapter";
import Siren from "../../../../../valueObjects/Siren";

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


            const stream = fs.createReadStream(filePath);

            stream
            .on('data', async (data) => {
                let parsedData = GenericParser.csvParse(data as Buffer);

                if (!header) {
                    header = parsedData[0];
                    parsedData = parsedData.slice(1);
                }

                await asyncForEach(parsedData, async (row) => {
                    if (GenericParser.isEmptyRow(row)) return;

                    currentRow++;
                    const parsedRow = GenericParser.linkHeaderToData(
                        header as string[],
                        row,
                    ) as unknown as SireneUniteLegaleDto;

                    if (!this.isToInclude(parsedRow)) return;

                    const entity = SireneStockUniteLegaleAdapter.dtoToEntity(parsedRow);
                    const dbo = SireneStockUniteLegaleAdapter.entityToDbo(entity);
                    await sireneStockUniteLegaleService.insertOne(dbo);
                    
                });

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

        return (LEGAL_CATEGORIES_ACCEPTED.includes(categorieJuridique) && 
        unitePurgee == null && (Siren.isSiren(data.siren)));
    }

}
