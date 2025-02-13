import * as fs from "fs";
import { DefaultObject, NestedDefaultObject } from "../../../@types";
import { GenericParser } from "../../../shared/GenericParser";

export default class FonjepParser {
    private static mapHeaderToData(pages: unknown[][]) {
        return pages.map(page => {
            const headers = page.slice(0, 1)[0] as string[];
            const trimHeaders = headers.map((h: string) => h.trim());

            const rows = page.slice(1, page.length) as (string | number)[][]; // Delete Headers

            return rows.map(data => GenericParser.linkHeaderToData(trimHeaders, data));
        });
    }

    public static parse(filePath: string): {
        tiers: DefaultObject<any>[];
        postes: DefaultObject<any>[];
        versements: DefaultObject<any>[];
        typePoste: DefaultObject<any>[];
        dispositifs: DefaultObject<any>[];
    } {
        const fileContent = this.getBuffer(filePath);
        const pagesWithName = GenericParser.xlsParseByPageName(fileContent);
        const pages = [
            pagesWithName["Tiers"],
            pagesWithName["Poste"],
            pagesWithName["Versement"],
            pagesWithName["TypePoste"],
            pagesWithName["Dispositif"],
        ];
        const [tiers, postes, versements, typePoste, dispositifs] = this.mapHeaderToData(pages);

        return { tiers, postes, versements, typePoste, dispositifs };
    }

    protected static getBuffer(file: string) {
        this.filePathValidator(file);

        console.log("Open and read file ...");

        return fs.readFileSync(file);
    }

    protected static filePathValidator(file: string) {
        if (!file) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }
        return true;
    }
}
