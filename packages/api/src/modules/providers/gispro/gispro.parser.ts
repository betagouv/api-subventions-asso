import tqdm = require("tqdm");
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { GenericParser } from "../../../shared/helpers/ParserHelper";
import GisproLineEntity from "./entities/gisproLineEntity";
import Gispro from "./@types/Gispro";

export default class GisproParser {
    static parse(content: Buffer, validator: (entity: Gispro) => boolean) {
        console.log("Open and read file ...");
        const pages = ParseHelper.xlsParse(content);
        const page = pages[2];
        console.log("Read file end");

        const header = page[0] as string[];

        const data = page.slice(1) as string[][];

        const entities: GisproLineEntity[] = [];
        for (const row of tqdm(data)) {
            const parsedData = ParseHelper.linkHeaderToData(header, row);
            const indexedRow = GenericParser.indexDataByPathObject(
                // TODO <string|number> ??
                GisproLineEntity.indexedInformationsPath,
                parsedData,
            ) as unknown as Gispro;
            const entity = new GisproLineEntity(indexedRow.ej, indexedRow.dauphinId, indexedRow.siret);

            if (validator(entity)) entities.push(entity);
        }
        return entities;
    }
}
