import tqdm = require("tqdm");
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import GisproJoinLineEntity from "./entities/gisproJoinLineEntity";
import GisproJoin from "./@types/GisproJoin";

export default class GisproJoinParser {
    static parse(content: Buffer, validator: (entity: GisproJoin) => boolean) {
        console.log("Open and read file ...");
        const pages = ParseHelper.xlsParse(content);
        const page = pages[2];
        console.log("Read file end");

        const header = page[0] as string[];

        const data = page.slice(1) as string[][];

        const entities: GisproJoinLineEntity[] = [];
        for (const row of tqdm(data)) {
            const parsedData = ParseHelper.linkHeaderToData(header, row);
            const indexedRow = ParseHelper.indexDataByPathObject(
                GisproJoinLineEntity.indexedInformationsPath,
                parsedData
            ) as unknown as GisproJoin;
            const entity = new GisproJoinLineEntity(indexedRow.ej, indexedRow.dauphinId, indexedRow.siret);

            if (validator(entity)) entities.push(entity);
        }
        return entities;
    }
}
