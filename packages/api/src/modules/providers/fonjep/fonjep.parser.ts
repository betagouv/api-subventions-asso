import * as fs from "fs";
import { SiretDto } from "dto";
import { DefaultObject, NestedDefaultObject } from "../../../@types";
import { GenericParser } from "../../../shared/GenericParser";

export default class FonjepParser {
    private static mapHeaderToData(pages: unknown[][]) {
        return pages.map(page => {
            const headers = page.slice(0, 1)[0] as string[];
            const trimHeaders = headers.map((h: string) => h.trim());

            const rows = page.slice(1, page.length) as (string | number)[][]; // Delete Headers

            return rows.map(data => GenericParser.linkHeaderToData(trimHeaders, data) as DefaultObject<string>);
        });
    }

    public static parse(filePath: string): {
        tiers: DefaultObject<string>[];
        postes: DefaultObject<string>[];
        versements: DefaultObject<string>[];
        typePoste: DefaultObject<string>[];
        dispositifs: DefaultObject<string>[];
    } {
        const fileContent = fs.readFileSync(filePath);
        const pages = GenericParser.xlsParse(fileContent);
        const [tiers, postes, versements, typePoste, dispositifs] = this.mapHeaderToData(pages);

        return { tiers, postes, versements, typePoste, dispositifs };
    }
}
