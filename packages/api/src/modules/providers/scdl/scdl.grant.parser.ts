import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { isEmptyRow } from "../../../shared/helpers/ParserHelper";
import { isNumberValid, isRna, isSiret } from "../../../shared/Validators";
import { isValidDate } from "../../../shared/helpers/DateHelper";
import { SCDL_MAPPER } from "./scdl.mapper";
import { ScdlGrantEntity } from "./@types/ScdlGrantEntity";

export default class ScdlGrantParser {
    protected static isGrantValid(grant: ScdlGrantEntity) {
        // mandatory fields
        if (!isSiret(grant.associationSiret)) return false;
        if (!isValidDate(grant.paymentStartDate)) return false;
        if (!isNumberValid(grant.amount)) return false;

        // optionnal fields
        if (!isRna(grant.associationRna) && grant.associationRna !== undefined) return false;
        if (!isValidDate(grant.paymentEndDate) && grant.paymentEndDate !== undefined) return false;
        return true;
    }

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

            if (this.isGrantValid(storableData)) storableChunk.push(storableData);
        }
        return storableChunk;
    }
}
