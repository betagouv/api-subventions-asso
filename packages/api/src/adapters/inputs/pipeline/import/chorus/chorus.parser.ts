import { GenericParser } from "../../../../../shared/GenericParser";
import { sanitizeFloat } from "../../../../../shared/helpers/NumberHelper";
import { ChorusDto, ChorusFseDto } from "./chorus.dto";

export class ChorusParser {
    private static NATIONAL_PAGE_NAME = "1. Extraction" as const;
    private static EUROPEAN_PAGE_NAME = "2. Extraction FEHBE" as const;

    public static fromBuffer(buffer: Buffer) {
        console.log("Reading file...");
        const pages = GenericParser.xlsxParse<string>(buffer);

        const dtos: { national: ChorusDto[] | null; european: ChorusFseDto[] | null } = {
            national: null,
            european: null,
        };

        // payment from france
        const mainPage = pages.find(page => page.name === this.NATIONAL_PAGE_NAME);
        if (mainPage) dtos.national = this.toDtos(mainPage.data) as ChorusDto[];
        // payment from europe
        const europeanPage = pages.find(page => page.name === this.EUROPEAN_PAGE_NAME);
        if (europeanPage) dtos.european = this.toDtos(europeanPage.data) as ChorusFseDto[];

        return dtos;
    }

    private static toDtos(rawData: string[][]) {
        const headers = this.renameEmptyHeaders(rawData[0]);
        const rows = rawData.slice(1);
        return rows.map(row => {
            const dto = GenericParser.linkHeaderToData<ChorusDto | ChorusFseDto>(headers, row);
            // @TODO: make a real mapper to apply transform methods
            return {
                ...dto,
                ["Montant payé"]: sanitizeFloat(dto["Montant payé"]),
                ["Date de dernière opération sur la DP"]: GenericParser.getDateFromXLSX(
                    dto["Date de dernière opération sur la DP"],
                ),
                ["Exercice comptable"]: sanitizeFloat(dto["Exercice comptable"]),
                ["N° poste EJ"]: dto["N° poste EJ"],
                ["N° poste DP"]: dto["N° poste DP"],
            } as ChorusDto | ChorusFseDto;
        });
    }

    // CHORUS exports have "double columns" sharing the same header (only the header for the first column is defined)
    // Because it is most of the time a code followed by its corresponding label we replace the header by two distinct headers :
    // LABEL + CODE | LABEL
    private static renameEmptyHeaders(headerRow) {
        const header: string[] = [];
        for (let i = 0; i < headerRow.length; i++) {
            // if header not defined, we take the previous one
            if (!headerRow[i]) {
                const name = header[i - 1] as string;

                // special case - the adjacent column is the structure name
                if (name === "Fournisseur payé (DP)") {
                    header.push("Désignation de la structure");
                } else {
                    // add CODE suffix to the first header
                    header[i - 1] = `${name} CODE`;
                    // rename empty header from the previous header
                    header.push(name.replace("&#32;", " ").trim());
                }
            } else {
                header.push(headerRow[i].replace(/&#32;/g, " ").trim());
            }
        }
        return header;
    }
}
