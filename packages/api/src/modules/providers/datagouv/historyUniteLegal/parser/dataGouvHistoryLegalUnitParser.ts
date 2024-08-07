import fs from "fs";
import * as ParseHelper from "../../../../../shared/helpers/ParserHelper";

import { asyncForEach } from "../../../../../shared/helpers/ArrayHelper";
import { isValidDate } from "../../../../../shared/helpers/DateHelper";
import { isEmptyRow } from "../../../../../shared/helpers/ParserHelper";
import { SaveCallback } from "../@types";
import { UniteLegalHistoryRow } from "../@types/UniteLegalHistoryRow";
import Siren from "../../../../../valueObjects/Siren";

export default class DataGouvHistoryLegalUnitParser {
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
        // entrée déjà persistée
        if (importDate && periodStart < importDate) return false;
        // modification non effective
        if (periodStart > now) return false;
        return true;
    }

    static parseUniteLegalHistory(
        file: string,
        save: SaveCallback<UniteLegalHistoryRow>,
        lastImportDate: Date | null = null,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            let totalEntities = 0;
            let header: null | string[] = null;

            const stream = fs.createReadStream(file);

            const streamPause = () => stream.pause();
            const streamResume = () => stream.resume();

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

                await asyncForEach(parsedChunk, async row => {
                    if (isEmptyRow(row)) return;

                    totalEntities++;
                    const parsedData = ParseHelper.linkHeaderToData(
                        header as string[],
                        row,
                    ) as unknown as UniteLegalHistoryRow;
                    if (!parsedData.siren || !Siren.isSiren(parsedData.siren)) return;

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
