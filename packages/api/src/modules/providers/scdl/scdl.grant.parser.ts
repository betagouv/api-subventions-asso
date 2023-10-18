import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { isSiret } from "../../../shared/Validators";
import { isEmptyRow } from "../../../shared/helpers/ParserHelper";
import { SCDL_MAPPER } from "./scdl.mapper";
import { ScdlGrantEntity } from "./@types/ScdlGrantEntity";

export default class ScdlGrantParser {
    static parseCsv(chunk: Buffer): ScdlGrantEntity[] {
        const parsedChunk = ParseHelper.csvParse(chunk, ";");
        const header = parsedChunk.shift();
        if (!header) return [];

        const storableChunk: ScdlGrantEntity[] = [];

        for (const csvRow of parsedChunk) {
            if (isEmptyRow(csvRow)) continue;
            const parsedData = ParseHelper.linkHeaderToData(header, csvRow);
            const storableData = ParseHelper.indexDataByPathObject(
                SCDL_MAPPER,
                parsedData,
            ) as unknown as ScdlGrantEntity;

            if (!storableData.associationSiret || !isSiret(storableData.associationSiret)) continue;
            storableChunk.push(storableData);
        }
        return storableChunk;
    }
}
