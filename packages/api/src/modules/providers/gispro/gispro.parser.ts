import tqdm = require("tqdm");
import { GenericParser } from "../../../shared/GenericParser";
import GisproLineEntity from "./entities/gisproLineEntity";
import Gispro from "./@types/Gispro";

export default class GisproParser {
    static pageIndexByYear = {
        2018: 0,
        2019: 0,
        2020: 0,
        2021: 0,
        2023: 1,
        2022: 2,
    };

    static parse(content: Buffer, configKey, validator: (entity: Gispro) => boolean) {
        console.log("Open and read file ...");
        const pages = GenericParser.xlsParse(content);
        const page = pages[GisproParser.pageIndexByYear[configKey]];
        console.log("Read file end");

        const header = page[0] as string[];

        const data = page.slice(1) as string[][];

        const entities: GisproLineEntity[] = [];
        for (const row of tqdm(data)) {
            const parsedData = GenericParser.linkHeaderToData(header, row);
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
