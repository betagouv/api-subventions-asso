import { ObjectId } from "mongodb";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { isSiret } from "../../../shared/Validators";
import { isEmptyRow } from "../../../shared/helpers/ParserHelper";
import { ScdlGrantDbo } from "./@types/ScdlGrantDbo";
import ScdlGrantEntity from "./entities/ScdlGrantEntity";

export default class DataGouvScdlGrantParser {
    static parseCsv(chunk: Buffer, extractId: ObjectId) {
        let parsedChunk = ParseHelper.csvParse(chunk as Buffer);
        const header: string[] = parsedChunk[0];
        parsedChunk = parsedChunk.slice(1);

        const storableChunk: ScdlGrantDbo[] = [];

        for (const csvRow of parsedChunk) {
            if (isEmptyRow(csvRow)) continue;

            const parsedData = ParseHelper.linkHeaderToData(header, csvRow);

            const storableData = ParseHelper.indexDataByPathObject(
                ScdlGrantEntity.InformationsPath,
                parsedData,
            ) as unknown as ScdlGrantDbo;

            if (!storableData.associationSiret || !isSiret(storableData.associationSiret)) continue;
            storableData.extractId = extractId;
            storableChunk.push(storableData);
        }
        return storableChunk;
    }
}
