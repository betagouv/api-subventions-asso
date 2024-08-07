import csvSyncParser = require("csv-parse/sync");
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import { isNumberValid } from "../../../shared/Validators";
import { isValidDate } from "../../../shared/helpers/DateHelper";
import Siret from "../../../valueObjects/Siret";
import Rna from "../../../valueObjects/Rna";
import { SCDL_MAPPER } from "./scdl.mapper";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";
import { ScdlParsedGrant } from "./@types/ScdlParsedGrant";

export default class ScdlGrantParser {
    protected static isGrantValid(grant: ScdlParsedGrant) {
        // mandatory fields
        if (!Siret.isSiret(grant.associationSiret)) return false;
        if (!isNumberValid(grant.amount)) return false;
        if (!isNumberValid(grant.exercice)) return false;
        // accept undefined and null as values as it is an optionnal field
        if (grant.paymentStartDate && !isValidDate(grant.paymentStartDate)) return false;

        // optional fields
        if (grant.conventionDate && !isValidDate(grant.conventionDate)) grant.conventionDate = undefined;
        if (grant.associationRna && !Rna.isRna(grant.associationRna)) grant.associationRna = undefined;
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

        return ScdlGrantParser._filterValidEntities(parsedChunk);
    }

    static parseExcel(content: Buffer, pageName?: string, rowOffset = 0) {
        console.log("Open and read file ...");
        const pagesWithName = ParserHelper.xlsParseWithPageName(content);
        console.log("Read file end");

        const extractionPage = pageName ? pagesWithName.find(page => page.name === pageName) : pagesWithName[0];
        if (!extractionPage?.data?.length) throw new Error("no data in required page (default is first page)");

        const page = extractionPage.data;

        const headerRow = page[rowOffset] as string[];
        console.log("Map rows to entities...");
        const data = page.slice(rowOffset + 1).map(row => ParserHelper.linkHeaderToData(headerRow, row));
        return ScdlGrantParser._filterValidEntities(data);
    }

    static _filterValidEntities(parsedChunk) {
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
