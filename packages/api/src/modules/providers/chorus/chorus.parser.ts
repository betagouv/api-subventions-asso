import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import IChorusIndexedInformations from "./@types/IChorusIndexedInformations";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import * as CliHelper from "../../../shared/helpers/CliHelper";

export default class ChorusParser {
    public static parse(content: Buffer) {
        const data = content
            .toString()
            .replace(/"/g, "")
            .replace("", "")
            .split("\n") // Select line by line
            .map(raw =>
                raw
                    .split(";")
                    .map(r => r.split("\t"))
                    .flat()
            ); // Parse column

        const headers = data.splice(0, 7);

        const header = headers[6].map((header, index) => {
            const isCode = headers[6].slice(index + 1).find(h => h === header);
            if (isCode) {
                return `${header.trim()} CODE`;
            }
            return header.trim();
        });

        return data.reduce((entities, raw) => {
            if (!raw.map(column => column.trim()).filter(c => c).length) return entities;
            const parsedData = ParseHelper.linkHeaderToData(header, raw);

            const indexedInformations = ParseHelper.indexDataByPathObject(
                ChorusLineEntity.indexedInformationsPath,
                parsedData
            ) as unknown as IChorusIndexedInformations;

            return entities.concat(
                new ChorusLineEntity(this.buildUniqueId(indexedInformations), indexedInformations, parsedData)
            );
        }, [] as ChorusLineEntity[]);
    }

    static parseXls(content: Buffer, validator: (entity: ChorusLineEntity) => boolean) {
        console.log("Open and read file ...");
        const pages = ParseHelper.xlsParse(content);
        const page = pages[0];
        console.log("Read file end");

        const headerRaw = page[0] as string[];
        const header: string[] = [];

        for (let i = 0; i < headerRaw.length; i++) {
            if (!headerRaw[i]) {
                const name = header[i - 1] as string;
                header[i - 1] = `${name} CODE`;
                header.push(name.replace("&#32;", " ").trim());
            } else {
                header.push(headerRaw[i].replace(/&#32;/g, " ").trim());
            }
        }

        const data = page.slice(1) as string[][];
        return data.reduce((entities, raw, index) => {
            CliHelper.printAtSameLine(`${index} entities parsed of ${data.length}`);

            const parsedData = ParseHelper.linkHeaderToData(header, raw);
            const indexedInformations = ParseHelper.indexDataByPathObject(
                ChorusLineEntity.indexedInformationsPath,
                parsedData
            ) as unknown as IChorusIndexedInformations;
            const entity = new ChorusLineEntity(
                this.buildUniqueId(indexedInformations),
                indexedInformations,
                parsedData
            );

            if (validator(entity)) {
                return entities.concat(entity);
            }
            return entities;
        }, [] as ChorusLineEntity[]);
    }

    private static buildUniqueId(indexedInformations: IChorusIndexedInformations): string {
        return `${indexedInformations.siret}-${indexedInformations.ej}-${indexedInformations.dateOperation}-${indexedInformations.amount}`;
    }
}
