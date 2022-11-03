import fs from "fs";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";

import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import { isSiren } from "../../../shared/Validators";
import { IStreamAction} from "./@types";
import { UniteLegalHistoryRaw } from "./@types/UniteLegalHistoryRaw";
import { isValidDate } from "../../../shared/helpers/DateHelper";

export default class DataGouvParser {   
    static parseUniteLegalHistory(file: string, lastImportDate: Date | null, save: (entity: UniteLegalHistoryRaw, streamPause: IStreamAction, streamResume: IStreamAction) => Promise<void>): Promise<void> {
        return new Promise((resolve, reject) => {

            let totalEntities = 0;
            let header: null | string[] = null;
    
            const stream = fs.createReadStream(file);

            const streamPause = () => stream.pause();
            const streamResume = () => stream.resume();

            const now = new Date();

            let logNumber = 1;
            let logTime = new Date();
                
            stream.on("data", async (chunk) => {
                let parsedChunk = ParseHelper.csvParse(chunk as Buffer);

                if (totalEntities > 500000 * logNumber) {
                    logNumber++;
                    console.log(`\n ${(new Date().getTime() - logTime.getTime()) / 1000 } sec`);
                    logTime = new Date();
                }

                if (!header) {
                    header = parsedChunk[0];
                    parsedChunk = parsedChunk.slice(1);
                }

                await asyncForEach(parsedChunk, async raw => {
                    if (!raw.map(column => column.trim()).filter(c => c).length) return;
                    totalEntities++;
                    const parsedData = ParseHelper.linkHeaderToData(header as string[], raw) as unknown as UniteLegalHistoryRaw;
                    if (!parsedData.siren || !isSiren(parsedData.siren)) return;

                    const periodStartDate = new Date(parsedData.dateDebut);
                    
                    if (
                        (!isValidDate(periodStartDate)) ||
                        (lastImportDate && lastImportDate > periodStartDate) ||
                        (now < periodStartDate)
                    ) return;

                    await save(parsedData, streamPause, streamResume);
                });
            });
    
            stream.on("error", (err) => reject(err));
    
            stream.on("end", () => {
                resolve();
            })
        }) 
    }
    
}