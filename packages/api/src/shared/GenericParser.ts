import fs from "fs";
import path from "path";
import xlsx from "node-xlsx";
import csvSyncParser = require("csv-parse/sync");
import {
    BeforeAdaptation,
    DefaultObject,
    NestedBeforeAdaptation,
    NestedDefaultObject,
    ParserInfo,
    ParserPath,
} from "../@types";
import type { ValueWithPath } from "./@types/ValueWithPath";

export class GenericParser {
    /*
        from parser info and original data, returns original key and data before adaptation
    */
    static findValueAndOriginalKeyByPath<T extends BeforeAdaptation>(
        data: NestedBeforeAdaptation<T>,
        parserData: ParserPath | ParserInfo<T, unknown>,
    ): ValueWithPath<T> | undefined {
        type TypeIn = T | DefaultObject;
        const mapper: ParserPath = Array.isArray(parserData) ? parserData : parserData.path;
        const successiveKeys: string[] = [];
        let objectToLookIn: TypeIn = data;
        let oneLevelKey: string | undefined;

        for (const possibleKeys of mapper) {
            // If it is a string, it is the only possible header for this property
            if (!Array.isArray(possibleKeys)) oneLevelKey = possibleKeys as string;
            // checking all possible headers for this property
            else oneLevelKey = (possibleKeys as string[]).find(possibleKey => data[possibleKey.trim()] != undefined); // TODO manage multiple valid case (with filters)

            if (!oneLevelKey) return undefined;

            successiveKeys.push(oneLevelKey);
            objectToLookIn = objectToLookIn[oneLevelKey.trim()] as TypeIn;
        }
        return { value: objectToLookIn as T, keyPath: successiveKeys };
    }

    /*
        from parser info and original data, returns required data after adaptation
     */
    static findAndAdaptByPath<TypeIn extends BeforeAdaptation, TypeOut = unknown>(
        data: NestedDefaultObject<TypeIn>,
        parserData: ParserPath | ParserInfo<TypeIn, TypeOut>,
    ) {
        let adapter = (v: TypeIn | undefined): unknown => v as TypeOut;

        if (!Array.isArray(parserData)) adapter = parserData.adapter || adapter;

        const original = GenericParser.findValueAndOriginalKeyByPath<TypeIn>(data, parserData);
        if (original?.value === undefined || original?.value === null) return undefined;

        return adapter(original.value) as TypeOut;
    }

    // equivalent of this method using findValueAndOriginalKeyByPath and keeping
    // original values and path can be found in scdl.grant.parser
    static indexDataByPathObject<TypeIn extends BeforeAdaptation, TypeOut = DefaultObject>(
        pathObject: DefaultObject<ParserPath | ParserInfo<TypeIn>>,
        data: NestedDefaultObject<TypeIn>,
    ) {
        return Object.keys(pathObject).reduce((acc, key: string) => {
            const tempAcc = acc;
            tempAcc[key] = GenericParser.findAndAdaptByPath<TypeIn>(data, pathObject[key]);
            return tempAcc;
        }, {} as TypeOut) as TypeOut;
    }

    static linkHeaderToData<T = string>(headers: string[], data: T[]) {
        return headers.reduce((acc, header, key) => {
            const value =
                typeof data[key] === "string" ? (data[key] as string).replace(/&#32;/g, " ").trim() : data[key];
            const trimedHeader = typeof header === "string" ? header.trim() : header;
            acc[trimedHeader] = value || "";
            return acc;
        }, {} as DefaultObject<T | string>);
    }

    static findFiles(file: string) {
        const files: string[] = [];

        if (fs.lstatSync(file).isDirectory()) {
            const filesInFolder = fs
                .readdirSync(file)
                .filter(fileName => !fileName.startsWith(".") && !fs.lstatSync(path.join(file, fileName)).isDirectory())
                .map(fileName => path.join(file, fileName));

            files.push(...filesInFolder);
        } else files.push(file);

        return files;
    }

    static csvParse(content: Buffer, delimiter = ";,"): string[][] {
        return csvSyncParser.parse(content, {
            columns: false,
            skip_empty_lines: true,
            delimiter: Array.from(delimiter),
            relax_column_count: true,
        });
    }

    static xlsParse(content: Buffer) {
        return GenericParser.xlsParseWithPageName(content).map(page => page.data);
    }

    static xlsParseWithPageName(content: Buffer) {
        const xls = xlsx.parse(content);
        return xls.map(xlsPage => ({
            data: xlsPage.data.filter(row => (row as unknown[]).length),
            name: xlsPage.name,
        }));
    }

    static ExcelDateToJSDate(serial: number) {
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        const date_info = new Date(utc_value * 1000).toISOString();

        const [year, month, rest] = date_info.split("-");
        const date = rest.substring(0, 2);

        const fractional_day = serial - Math.floor(serial) + 0.0000001;

        let total_seconds = Math.floor(86400 * fractional_day);

        const seconds = total_seconds % 60;

        total_seconds -= seconds;

        const hours = Math.floor(total_seconds / (60 * 60));
        const minutes = Math.floor(total_seconds / 60) % 60;

        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(date), hours, minutes, seconds));
    }

    static isEmptyRow = (row: string[]) => !row.map(column => column.trim()).filter(c => c).length;
}
