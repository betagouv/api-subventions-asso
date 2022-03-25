import fs from "fs";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import * as CliHelper from "../../../shared/helpers/CliHelper";

import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import EntrepriseSirenEntity from "./entities/EntrepriseSirenEntity";
import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import { formatBytes } from "../../../shared/helpers/LogHelper";
import RnaSiren from "../../rna-siren/entities/RnaSirenEntity";
import { isRna, isSiren } from "../../../shared/Validators";
import { UniteLegalRaw, IStreamAction} from "./@types";

export default class DataGouvParser {
    static parseUniteLegal(file: string, save: (entity: EntrepriseSirenEntity | RnaSiren, streamPause: IStreamAction, streamResume: IStreamAction) => Promise<void>): Promise<void> {
        return new Promise((resolve, reject) => {
            const stats = fs.statSync(file)
            const fileSize = formatBytes(stats.size);

            let totalByteReads = 0;
            let totalEntities = 0;
            let header: null | string[] = null;
    
            const stream = fs.createReadStream(file);

            const streamPause = () => stream.pause();
            const streamResume = () => stream.resume();

            let logNumber = 1;
            let logTime = new Date();
                
            stream.on("data", async (chunk) => {
                totalByteReads += Buffer.byteLength(chunk);
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
                    const parsedData = ParseHelper.linkHeaderToData(header as string[], raw) as unknown as UniteLegalRaw;

                    CliHelper.printAtSameLine(`${totalEntities} entities parsed (${formatBytes(totalByteReads)} / ${fileSize})`);

                    if (!parsedData.siren || !isSiren(parsedData.siren)) return;

                    if (!LEGAL_CATEGORIES_ACCEPTED.includes(parsedData.categorieJuridiqueUniteLegale)) {
                        await save(
                            new EntrepriseSirenEntity(parsedData.siren),
                            streamPause,
                            streamResume
                        );
                    } else if (parsedData.identifiantAssociationUniteLegale.length > 0 && isRna(parsedData.identifiantAssociationUniteLegale)) {
                        await save(
                            new RnaSiren(parsedData.identifiantAssociationUniteLegale, parsedData.siren),
                            streamPause,
                            streamResume
                        );
                    }
                });
            });
    
            stream.on("error", (err) => reject(err));
    
            stream.on("end", () => {
                resolve();
            })

        }) 
    }
    
}