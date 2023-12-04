import fs from "fs";
import CliLogger from "../../../../shared/CliLogger";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import HistoryUniteLegalImportEntity from "../../../../entities/HistoryUniteLegalImportEntity";
import { downloadFile } from "../../../../shared/helpers/FileHelper";
import inseeFilesService from "../insee.files.service";
import inseeEstablishmentPort from "../../../../dataProviders/db/insee-establishments/inseeEstablishment.port";
import * as ParserHelper from "../../../../shared/helpers/ParserHelper";

import uniteLegalEntreprisesService from "../../uniteLegalEntreprises/uniteLegal.entreprises.service";

import { isEmptyRow } from "../../../../shared/helpers/ParserHelper";
import { asyncForEach } from "../../../../shared/helpers/ArrayHelper";
import { isSiren } from "../../../../shared/Validators";
import { SaveCallback } from "./@types";
import { StockEtabAdapter } from "./stockEtab.adapter";

export class BigFileParserService {
    async updateEstablishments() {
        const archivePath = await downloadFile(
            "https://files.data.gouv.fr/insee-sirene/StockEtablissement_utf8.zip",
            "output/StockEtablissement_utf8.zip",
        );
        const filePath = await inseeFilesService.decompressArchive(archivePath, "output/StockEtablissement_utf8.csv");
        await this.parse(filePath, new Date());
    }

    async parse(file: string, date: Date, logger?: CliLogger) {
        if (logger) logger.logIC(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        if (!isValidDate(date)) {
            throw new Error("date is required");
        }

        const lastImportDate = await uniteLegalImportService.getLastDateImport(); // TODO make generic ?

        const chunksMetadata = {
            chunksInSave: 0,
            chunksSize: 1000,
        };
        const stackEtab: StockEtabRow[] = [];
        // TODO still need factory ?
        const saveEntityMethod = this._saveEntityFactory(stackEtab, chunksMetadata);

        await this._parse(file, saveEntityMethod, lastImportDate);

        // remaining values
        if (stackEtab.length) await this._save(stackEtab);

        // TODO refactor to make generic ?
        await uniteLegalImportService.addNewImport(new HistoryUniteLegalImportEntity(file, date, new Date()));
    }

    private async _isEtabFromAsso(entity: StockEtabRow) {
        // TODO async, look in entreprise
        return await uniteLegalEntreprisesService.isEntreprise(entity.siren)
    }

    private async _save(rows: StockEtabRow[]) {
        for (const row of rows) {
            const entity = StockEtabAdapter.rowToInseeEtab(row);
            await inseeEstablishmentPort.insert(entity);
        }
    }

    private _saveEntityFactory(
        stack: StockEtabRow[],
        chunksMetadata: { chunksSize: number; chunksInSave: number },
    ): SaveCallback<StockEtabRow> {
        return async (entity, streamPause, streamResume) => {
            if (await this._isEtabFromAsso(entity)) stack.push(entity);

            if (stack.length < chunksMetadata.chunksSize) return;

            streamPause();
            chunksMetadata.chunksInSave++;

            if (stack.length >= chunksMetadata.chunksSize) await this._save(stack.splice(-chunksMetadata.chunksSize));

            chunksMetadata.chunksInSave--;
            if (chunksMetadata.chunksInSave === 0) streamResume();
        };
    }

    private _parse<T>(
        file: string,
        save: SaveCallback<T>,
        isParsedDataValid: (parsedData: T) => boolean,
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
                let parsedChunk = ParserHelper.csvParse(chunk as Buffer);

                if (totalEntities > 500000 * logNumber) {
                    logNumber++;
                    console.log(`\n ${(new Date().getTime() - logTime.getTime()) / 1000} sec`);
                    logTime = new Date();
                }

                if (!header) {
                    header = parsedChunk[0];
                    parsedChunk = parsedChunk.slice(1);
                }

                await asyncForEach(parsedChunk, async (row: string[]) => {
                    if (isEmptyRow(row)) return;

                    totalEntities++;
                    const parsedData = ParserHelper.linkHeaderToData(
                        header as string[],
                        row,
                    ) as unknown as T;

                    if (!isParsedDataValid(parsedData))

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
