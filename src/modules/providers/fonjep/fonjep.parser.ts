import { Siret } from "../../../@types/Siret";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import IFonjepIndexedInformations from "./@types/IFonjepIndexedInformations";
import FonjepRequestEntity from "./entities/FonjepRequestEntity";

export default class FonjepParser {
    public static parse(fileContent: Buffer) {
        const data = ParseHelper.xlsParse(fileContent)[0]; // Use 0 because file have only one page
        const headers = data.slice(0,1)[0] as string[];
        const raws = data.slice(1, data.length) as (string|number)[][]; // Delete Headers 
        return raws.reduce((entities, raw) => {
            if (!raw.map(column => typeof column === "string" ? column.trim() : column ).filter(c => c).length) return entities;
            const parsedData = ParseHelper.linkHeaderToData(headers, raw as string[]);

            const indexedInformations = ParseHelper.indexDataByPathObject(FonjepRequestEntity.indexedProviderInformationsPath, parsedData) as unknown as IFonjepIndexedInformations;
            const legalInformations = ParseHelper.indexDataByPathObject(FonjepRequestEntity.indexedLegalInformationsPath, parsedData) as { siret: Siret, name: string };

            return entities.concat(new FonjepRequestEntity(legalInformations, indexedInformations, parsedData));
        }, [] as FonjepRequestEntity[]);
    }
}