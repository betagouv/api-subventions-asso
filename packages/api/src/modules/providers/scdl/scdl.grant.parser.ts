import csvSyncParser = require("csv-parse/sync");
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import { isNumberValid, isRna, isSiret } from "../../../shared/Validators";
import { isValidDate } from "../../../shared/helpers/DateHelper";
import { SCDL_MAPPER } from "./scdl.mapper";
import { ScdlGrantEntity } from "./@types/ScdlGrantEntity";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";

export default class ScdlGrantParser {
    protected static isGrantValid(grant: Omit<ScdlGrantEntity, "allocatorName">) {
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

    static parseCsv(chunk: Buffer, delimiter = ";") {
        const parsedChunk = csvSyncParser.parse(chunk, {
            columns: true,
            skip_empty_lines: true,
            delimiter,
            trim: true,
        });

        console.log(`${parsedChunk.length} parsed line`);

        const storableChunk: ScdlStorableGrant[] = [];

        for (const parsedData of parsedChunk) {
            const entity = ParserHelper.indexDataByPathObject(SCDL_MAPPER, parsedData) as unknown as Omit<
                ScdlGrantEntity,
                "allocatorName"
            >;
            if (this.isGrantValid(entity)) storableChunk.push({ ...entity, __data__: parsedData });
            else {
                console.log(parsedData);
                break;
            }
        }

        console.log(`${storableChunk.length} valid entity created from parsed line`);
        return storableChunk;
    }
}
