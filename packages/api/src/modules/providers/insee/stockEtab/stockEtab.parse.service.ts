import fs from "fs";
import CliLogger from "../../../../shared/CliLogger";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { downloadFile } from "../../../../shared/helpers/FileHelper";
import inseeFilesService from "../insee.files.service";
import inseeEstablishmentPort from "../../../../dataProviders/db/insee-establishments/inseeEstablishment.port";
import * as ParserHelper from "../../../../shared/helpers/ParserHelper";

import uniteLegalEntreprisesService from "../../uniteLegalEntreprises/uniteLegal.entreprises.service";

import { isEmptyRow } from "../../../../shared/helpers/ParserHelper";
import { asyncForEach } from "../../../../shared/helpers/ArrayHelper";
import { isSiren } from "../../../../shared/Validators";
import { SaveCallback } from "../historyUniteLegal/@types";
import { StockEtabAdapter } from "./stockEtab.adapter";
import { StockEtabRow } from "./@types/stockEtabRow";

export class StockEtabParseService {
    private static chunksMetadata = {
        chunksInSave: 0,
        chunksSize: 5 //1000,
    };

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

        const lastImportDate = new Date("2020-05-01")
            // await uniteLegalImportService.getLastDateImport(); // TODO make generic ?

        const stackEtab: StockEtabRow[] = [];
        // TODO still need factory ?
        const saveEntityMethod = this._batchSaveEntityFactory(stackEtab);

        await this._parse(file, saveEntityMethod, lastImportDate);

        // remaining values
        if (stackEtab.length) await this._save(stackEtab);

        // TODO refactor to make generic ?
        // await uniteLegalImportService.addNewImport(new HistoryUniteLegalImportEntity(file, date, new Date()));
    }

    private async _isEtabFromAsso(entity: StockEtabRow) {
        // TODO async, look in entreprise
        return await uniteLegalEntreprisesService.isEntreprise(entity.siren);
    }

    private _save(rows: StockEtabRow[]) {
        return inseeEstablishmentPort.insertMany(rows.map(row => StockEtabAdapter.rowToInseeEtab(row)))
    }

    /*
    * resulting function stores entities until reaching chunkSize
    * then pauses read stream, adapts and saves data, then resumes
    * */
    private _batchSaveEntityFactory(
        stack: StockEtabRow[],
    ): SaveCallback<StockEtabRow> {
        return async (entity: StockEtabRow, streamPause, streamResume) => {
            if (await this._isEtabFromAsso(entity)) stack.push(entity);

            if (stack.length < StockEtabParseService.chunksMetadata.chunksSize) return;

            streamPause();
            StockEtabParseService.chunksMetadata.chunksInSave++;

            if (stack.length >= StockEtabParseService.chunksMetadata.chunksSize)
                await this._save(stack.splice(-StockEtabParseService.chunksMetadata.chunksSize));

            StockEtabParseService.chunksMetadata.chunksInSave--;
            if (StockEtabParseService.chunksMetadata.chunksInSave === 0) streamResume();
        };
    }

    /*
    * stream reads data, calls validator to filter and calls save
    * */
    private _parse(file: string, save: SaveCallback<StockEtabRow>, lastImportDate: Date | null = null): Promise<void> {
        return new Promise((resolve, reject) => {
            let totalEntities = 0;
            let header: null | string[] = null;

            const stream = fs.createReadStream(file);

            const streamPause = () => stream.pause();
            const streamResume = () => stream.resume();

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
                    ) as unknown as StockEtabRow;
                    if (!parsedData.siren || !isSiren(parsedData.siren)) return;

                    if (!lastImportDate || new Date(parsedData.dateDernierTraitementEtablissement) < lastImportDate)
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

const stockEtabParseService = new StockEtabParseService();

export default stockEtabParseService;
