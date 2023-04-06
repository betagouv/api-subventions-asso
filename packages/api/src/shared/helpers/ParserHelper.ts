import fs from "fs";
import path from "path";
import xlsx from "node-xlsx";

import { ParserInfo, ParserPath, DefaultObject } from "../../@types";

export function findByPath<T>(data: unknown, parserData: ParserPath | ParserInfo) {
    let path: ParserPath;
    let adapter = (v: string | undefined): unknown => v;

    if (Array.isArray(parserData)) {
        path = parserData;
    } else {
        path = parserData.path;
        adapter = parserData.adapter || adapter;
    }

    const result = path.reduce((acc, name) => {
        if (acc === undefined) return acc;

        const obj = acc as { [key: string]: string };

        if (!(name instanceof Array)) {
            // So is string
            return obj[name];
        }

        const key = name.find(key => obj[key.trim()]); // TODO manage multiple valid case (with filters)

        if (!key) return undefined;
        return obj[key.trim()];
    }, data) as string;

    return adapter(result) as T;
}

export function indexDataByPathObject(
    pathObject: DefaultObject<ParserPath | ParserInfo>,
    data: DefaultObject<unknown>,
) {
    return Object.keys(pathObject).reduce((acc, key: string) => {
        const tempAcc = acc as { [key: string]: string };
        tempAcc[key] = findByPath(data, pathObject[key]);
        return tempAcc;
    }, {} as unknown) as DefaultObject<string | number>;
}

export function linkHeaderToData(header: string[], data: unknown[]) {
    return header.reduce((acc, header, key) => {
        const value = typeof data[key] === "string" ? (data[key] as string).replace(/&#32;/g, " ").trim() : data[key];
        const trimedHeader = typeof header === "string" ? header.trim() : header;
        acc[trimedHeader] = value || "";
        return acc;
    }, {} as DefaultObject<unknown>);
}

export function findFiles(file: string) {
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

export function csvParse(content: Buffer) {
    return content
        .toString()
        .split("\n") // Select line by line
        .map(raw => raw.split(/[\t;,]/).flat()); // Parse column
}

export function xlsParse(content: Buffer) {
    return xlsParseWithPageName(content).map(page => page.data);
}

export function xlsParseWithPageName(content: Buffer) {
    const xls = xlsx.parse(content, {
        raw: true,
        rawNumbers: true,
        cellNF: true,
        dateNF: "165",
    });
    return xls.map(xlsPage => ({
        data: xlsPage.data.filter(row => (row as unknown[]).length),
        name: xlsPage.name,
    }));
}

export function ExcelDateToJSDate(serial: number) {
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
