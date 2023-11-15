import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import * as CliHelper from "../../../shared/helpers/CliHelper";
import IChorusIndexedInformations from "./@types/IChorusIndexedInformations";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import { ChorusService } from "./chorus.service";

export default class ChorusParser {
    public static parse(content: Buffer) {
        const data = content
            .toString()
            .replace(/"/g, "")
            .replace("", "")
            .split("\n") // Select line by line
            .map(row =>
                row
                    .split(";")
                    .map(r => r.split("\t"))
                    .flat(),
            ); // Parse column

        const headers = data.splice(0, 7);

        const header = headers[6].map((header, index) => {
            const isCode = headers[6].slice(index + 1).find(h => h === header);
            if (isCode) {
                return `${header.trim()} CODE`;
            }
            return header.trim();
        });

        return data.reduce((entities, row) => {
            if (!row.map(column => column.trim()).filter(c => c).length) return entities;
            const parsedData = ParseHelper.linkHeaderToData(header, row);

            const indexedInformations = ParseHelper.indexDataByPathObject(
                ChorusLineEntity.indexedInformationsPath,
                parsedData,
            ) as unknown as IChorusIndexedInformations;

            return entities.concat(
                new ChorusLineEntity(ChorusService.buildUniqueId(indexedInformations), indexedInformations, parsedData),
            );
        }, [] as ChorusLineEntity[]);
    }

    // CHORUS exports have "double columns" sharing the same header (only the header for the first column is defined)
    // Because it is always a code followed by its corresponding label we replace the header by two distinct headers :
    // LABEL + CODE | LABEL
    private static renameEmptyHeaders(headerRow) {
        const header: string[] = [];
        for (let i = 0; i < headerRow.length; i++) {
            // if header not defined, we take the previous one
            if (!headerRow[i]) {
                const name = header[i - 1] as string;
                // we add CODE at the end of the previous header
                header[i - 1] = `${name} CODE`;
                header.push(name.replace("&#32;", " ").trim());
            } else {
                header.push(headerRow[i].replace(/&#32;/g, " ").trim());
            }
        }
        return header;
    }

    static parseXls(content: Buffer, validator: (entity: ChorusLineEntity) => boolean) {
        console.log("Open and read file ...");
        const pages = ParseHelper.xlsParse(content);
        const page = pages[0];
        console.log("Read file end");

        const headerRow = page[0] as string[];

        const header = ChorusParser.renameEmptyHeaders(headerRow);

        // rename empty header

        const data = page.slice(1) as string[][];
        return data.reduce((entities, row, index) => {
            CliHelper.printAtSameLine(`${index} entities parsed of ${data.length}`);

            const parsedData = ParseHelper.linkHeaderToData(header, row);
            const indexedInformations = ParseHelper.indexDataByPathObject(
                ChorusLineEntity.indexedInformationsPath,
                parsedData,
            ) as unknown as IChorusIndexedInformations;
            const entity = new ChorusLineEntity(
                ChorusService.buildUniqueId(indexedInformations),
                indexedInformations,
                parsedData,
            );

            if (validator(entity)) {
                return entities.concat(entity);
            }
            return entities;
        }, [] as ChorusLineEntity[]);
    }
}
