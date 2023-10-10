import { ObjectId } from "mongodb";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { isSiret } from "../../../shared/Validators";
import { isEmptyRow } from "../../../shared/helpers/ParserHelper";
import { ScdlGrantDbo } from "../datagouv/@types/ScdlGrantDbo";
import { ScdlGrantSchema } from "./@types/ScdlGrantSchema";

export default class ScdlGrantParser {
    static parseCsv(chunk: Buffer, schema: ScdlGrantSchema, extractId: ObjectId): ScdlGrantDbo[] {
        const parsedChunk = ParseHelper.csvParse(chunk, ";");
        const header = parsedChunk.shift();
        if (!header) return [];

        const storableChunk: ScdlGrantDbo[] = [];

        for (const csvRow of parsedChunk) {
            if (isEmptyRow(csvRow)) continue;
            const parsedData = ParseHelper.linkHeaderToData(header, csvRow);
            const storableData = ParseHelper.indexDataByPathObject(schema, parsedData) as unknown as ScdlGrantDbo;

            if (!storableData.associationSiret || !isSiret(storableData.associationSiret)) continue;
            storableData.extractId = extractId;
            storableChunk.push(storableData);
        }
        return storableChunk;
    }
}
