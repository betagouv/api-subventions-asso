import csvSyncParser = require("csv-parse/sync");
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import { isNumberValid, isRna, isSiret } from "../../../shared/Validators";
import { isValidDate } from "../../../shared/helpers/DateHelper";
import { SCDL_MAPPER } from "./scdl.mapper";
import { ScdlGrantEntity } from "./@types/ScdlGrantEntity";

export default class ScdlGrantParser {
    protected static isGrantValid(grant: ScdlGrantEntity) {
        // mandatory fields
        if (!isSiret(grant.associationSiret)) return false;
        if (!isValidDate(grant.conventionDate)) return false;
        if (!isNumberValid(grant.amount)) return false;
        if (!isValidDate(grant.paymentStartDate)) return false;

        // optional fields
        if (!isRna(grant.associationRna) && grant.associationRna !== undefined) grant.associationRna = undefined;
        if (!isValidDate(grant.paymentEndDate) && grant.paymentEndDate !== undefined) grant.paymentEndDate = undefined;

        return true;
    }

    static parseCsv(chunk: Buffer, delimiter = ";"): ScdlGrantEntity[] {
        const parsedChunk = csvSyncParser.parse(chunk, {
            columns: true,
            skip_empty_lines: true,
            delimiter,
            trim: true,
        });

        const storableChunk: ScdlGrantEntity[] = [];

        for (const parsedData of parsedChunk) {
            const storableData = ParserHelper.indexDataByPathObject(
                SCDL_MAPPER,
                parsedData,
            ) as unknown as ScdlGrantEntity;

            if (this.isGrantValid(storableData)) storableChunk.push(storableData);
        }
        return storableChunk;
    }
}
