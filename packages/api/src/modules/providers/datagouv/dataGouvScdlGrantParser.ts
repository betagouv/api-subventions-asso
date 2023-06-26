import fs from "fs";
import { ObjectId } from "mongodb";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { isSiret } from "../../../shared/Validators";
import { SaveCallback } from "./@types";
import { ScdlGrantDbo } from "./@types/ScdlGrantDbo";
import ScdlGrantEntity from "./entities/ScdlGrantEntity";

export default class DataGouvScdlGrantParser {
    static parseCsv(filePath: string, save: SaveCallback<ScdlGrantDbo>, extractId: ObjectId): Promise<void> {
        return new Promise((resolve, reject) => {
            let totalEntities = 0;
            let header: null | string[] = null;

            const stream = fs.createReadStream(filePath);

            const streamPause = () => stream.pause();
            const streamResume = () => stream.resume();
            const isEmptyRow = (row: string[]) => !row.map(column => column.trim()).filter(c => c).length;

            let logNumber = 1;
            let logTime = new Date();

            stream.on("data", async chunk => {
                let parsedChunk = ParseHelper.csvParse(chunk as Buffer);

                if (totalEntities > 500000 * logNumber) {
                    logNumber++;
                    console.log(`\n ${(new Date().getTime() - logTime.getTime()) / 1000} sec`);
                    logTime = new Date();
                }

                if (!header) {
                    header = parsedChunk[0];
                    parsedChunk = parsedChunk.slice(1);
                }

                for (const csvRow of parsedChunk) {
                    if (isEmptyRow(csvRow)) return;

                    totalEntities++;
                    const parsedData = ParseHelper.linkHeaderToData(header as string[], csvRow);

                    const storableData = ParseHelper.indexDataByPathObject(
                        ScdlGrantEntity.InformationsPath,
                        parsedData,
                    ) as unknown as ScdlGrantDbo;

                    if (!storableData.associationSiret || !isSiret(storableData.associationSiret)) return;
                    storableData.extractId = extractId;

                    await save(storableData, streamPause, streamResume);
                }
            });

            stream.on("error", err => reject(err));

            stream.on("end", () => {
                resolve();
            });
        });
    }
}
