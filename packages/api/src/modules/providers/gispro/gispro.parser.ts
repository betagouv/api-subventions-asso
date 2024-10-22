import tqdm = require("tqdm");
import { GenericParser } from "../../../shared/GenericParser";
import GisproLineEntity from "./entities/gisproLineEntity";
import Gispro from "./@types/Gispro";

export default class GisproParser {
    static configByYear = {
        2018: { pageIndex: 0 },
        2019: { pageIndex: 0 },
        2020: { pageIndex: 0 },
        2021: { pageIndex: 0 },
        2023: { pageIndex: 1 },
        2022: { pageIndex: 2 },
    };

    static parse(content: Buffer, configKey, validator: (entity: Gispro) => boolean) {
        console.log("Open and read file ...");
        const pages = GenericParser.xlsParse(content);
        const page = pages[GisproParser.configByYear[configKey].pageIndex];
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
