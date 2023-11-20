import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import * as CliHelper from "../../../shared/helpers/CliHelper";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import chorusService, { ChorusService } from "./chorus.service";

export default class ChorusParser {
    static parse(content: Buffer) {
        console.log("Open and read file ...");
        const pages = ParseHelper.xlsParse(content);
        console.log("Read file end");

        const page = pages[0];

        const headerRow = page[0] as string[];
        const headers = ChorusParser.renameEmptyHeaders(headerRow);
        console.log("Map rows to entities...");
        const entities = this.rowsToEntities(headers, page.slice(1));
        console.log(`${entities.length} entity ready to be saved...`);
        return entities;
    }

    // CHORUS exports have "double columns" sharing the same header (only the header for the first column is defined)
    // Because it is always a code followed by its corresponding label we replace the header by two distinct headers :
    // LABEL + CODE | LABEL
    protected static renameEmptyHeaders(headerRow) {
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

    protected static rowsToEntities(headers, rows) {
        const entities = rows
            .map(row => ({ parsedData: ParseHelper.linkHeaderToData(headers, row) }))
            .map(this.addIndexedInformations)
            .map(this.addUniqueId)
            .map(this.mapToEntity)
            .filter(this.validateEntity);
        return entities;
    }

    protected static addIndexedInformations(partialChorusEntity) {
        const indexedInformations = ParseHelper.indexDataByPathObject(
            ChorusLineEntity.indexedInformationsPath,
            partialChorusEntity.parsedData,
        );
        return { ...partialChorusEntity, indexedInformations };
    }

    protected static addUniqueId(partialChorusEntity) {
        return {
            ...partialChorusEntity,
            uniqueId: ChorusService.buildUniqueId(partialChorusEntity.indexedInformations),
        };
    }

    protected static mapToEntity(obj, index, array) {
        const entity = new ChorusLineEntity(obj.uniqueId, obj.indexedInformations, obj.parsedData);
        CliHelper.printAtSameLine(`${index} entities parsed of ${array.length}`);
        return entity;
    }

    protected static validateEntity(entity) {
        try {
            return chorusService.validateEntity(entity);
        } catch (e) {
            console.log(
                `\n\nThis request is not registered because: ${(e as Error).message}\n`,
                JSON.stringify(entity, null, "\t"),
            );
            return false;
        }
    }
}
