import fs from "fs";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";

import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import { isSiren } from "../../../shared/Validators";
import { isValidDate } from "../../../shared/helpers/DateHelper";
import { IStreamAction } from "./@types";
import { UniteLegalHistoryRaw } from "./@types/UniteLegalHistoryRaw";

export interface SaveCallback {
    (entity: UniteLegalHistoryRaw, streamPause: IStreamAction, streamResume: IStreamAction): Promise<void>;
}
export default class DataGouvParser {
    private static isDatesValid({
        periodStart,
        importDate,
        now,
    }: {
        periodStart: Date;
        importDate: Date | null;
        now: Date;
    }) {
        // date de début invalide
        if (!isValidDate(periodStart)) return false;
        // modification non effective
        if (periodStart > now) return false;
        // entrée déjà persistée
        if (importDate && periodStart < importDate) return false;
        return true;
    }

    static parseUniteLegalHistory(file: string, save: SaveCallback, lastImportDate: Date | null = null): Promise<void> {
        return new Promise((resolve, reject) => {
            let totalEntities = 0;
            let header: null | string[] = null;

            const stream = fs.createReadStream(file);

            const streamPause = () => stream.pause();
            const streamResume = () => stream.resume();
            const isEmptyRaw = (raw: string[]) => !raw.map(column => column.trim()).filter(c => c).length;

            const now = new Date();
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

                await asyncForEach(parsedChunk, async raw => {
                    if (isEmptyRaw(raw)) return;

                    totalEntities++;
                    const parsedData = ParseHelper.linkHeaderToData(
                        header as string[],
                        raw,
                    ) as unknown as UniteLegalHistoryRaw;
                    if (!parsedData.siren || !isSiren(parsedData.siren)) return;

                    const periodStartDate = new Date(parsedData.dateDebut);

                    if (
                        !this.isDatesValid({
                            periodStart: periodStartDate,
                            importDate: lastImportDate,
                            now,
                        })
                    )
                        return;

                    await save(parsedData, streamPause, streamResume);
                });
            });

            stream.on("error", err => reject(err));

            stream.on("end", () => {
                resolve();
            });
        });
    }
}
