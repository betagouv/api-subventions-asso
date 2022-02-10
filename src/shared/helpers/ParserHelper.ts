import fs from "fs";
import path from "path";

import { ParserInfo } from "../../@types/ParserInfo";
import ParserPath from "../../@types/ParserPath";

export function findByPath<T>(data: unknown, parserData: ParserPath | ParserInfo) {
    let path: ParserPath;
    let adatper = (v: string | undefined): unknown => v;

    if (Array.isArray(parserData)) {
        path = parserData;
    }
    else {
        path = parserData.path;
        adatper = parserData.adapter || adatper;
    }

    const result = path.reduce((acc, name) => {
        if (acc === undefined) return acc;

        const obj = acc as {[key: string]: string};

        if (!(name instanceof Array)) { // So is string
            return obj[name];
        }

        const key = name.find((key) => obj[key]); // TODO manage multiple valid case (with filters)

        if (!key) return undefined
        return obj[key];
    }, data) as string;

    return adatper(result) as T;
}

export function findFiles(file: string) {
    const files = [];

    if (fs.lstatSync(file).isDirectory()) {
        const filesInFolder = fs
            .readdirSync(file)
            .filter(fileName => !fileName.startsWith(".") && !fs.lstatSync(path.join(file, fileName)).isDirectory())
            .map((fileName => path.join(file, fileName)));

        files.push(...filesInFolder);
    } else files.push(file);

    return files;
}