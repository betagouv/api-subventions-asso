import csvSyncParser = require("csv-parse/sync");
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import { isNumberValid, isRna, isSiret } from "../../../shared/Validators";
import { isValidDate } from "../../../shared/helpers/DateHelper";
import { SCDL_MAPPER } from "./scdl.mapper";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";
import { ScdlParsedGrant } from "./@types/ScdlParsedGrant";

export default class ScdlGrantParser {
    protected static isGrantValid(grant: ScdlParsedGrant) {
        // mandatory fields
        if (!isSiret(grant.associationSiret)) return false;
        if (!isNumberValid(grant.amount)) return false;
        if (!isValidDate(new Date(grant.exercice))) return false;
        // accept undefined and null as values as it is an optionnal field
        if (grant.paymentStartDate && !isValidDate(grant.paymentStartDate)) return false;

        // optional fields
        if (grant.conventionDate && !isValidDate(grant.conventionDate)) grant.conventionDate = undefined;
        if (grant.associationRna && !isRna(grant.associationRna)) grant.associationRna = undefined;
        if (grant.paymentEndDate && !isValidDate(grant.paymentEndDate)) grant.paymentEndDate = undefined;

        return true;
    }

    static parseCsv(chunk: Buffer, delimiter = ";") {
        const parsedChunk = csvSyncParser.parse(chunk, {
            columns: true,
            skip_empty_lines: true,
            delimiter,
            trim: true,
        });

        const storableChunk: ScdlStorableGrant[] = [];
        const invalidEntities: Partial<ScdlStorableGrant>[] = [];

        for (const parsedData of parsedChunk) {
            const entity = ParserHelper.indexDataByPathObject(SCDL_MAPPER, parsedData) as unknown as ScdlParsedGrant;
            if (this.isGrantValid(entity)) storableChunk.push({ ...entity, __data__: parsedData });
            else {
                invalidEntities.push(entity);
            }
        }

        if (invalidEntities.length) {
            console.log(`WARNING : ${invalidEntities.length} entities invalid`);
            console.log(`Here some of them: `, invalidEntities.slice(0, 3));
        }

        return storableChunk;
    }
}
