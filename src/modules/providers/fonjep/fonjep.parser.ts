import { Siret } from "../../../@types/Siret";
import { DefaultObject } from "../../../@types/utils";
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
            const parsedData = headers.reduce((acc, header, key) => {
                acc[header.trim()] = raw[key];
                return acc;
            }, {} as DefaultObject<string|number>);

            const indexedInformations = Object.keys(FonjepRequestEntity.indexedProviderInformationsPath).reduce((acc, key: string) => {
                const tempAcc = (acc as { [key: string ] : string} );
                tempAcc[key] = ParseHelper.findByPath(parsedData, FonjepRequestEntity.indexedProviderInformationsPath[key]);
                return tempAcc;
            }, {} as unknown) as IFonjepIndexedInformations

            const legalInformations = Object.keys(FonjepRequestEntity.indexedLegalInformationsPath).reduce((acc, key: string) => {
                const tempAcc = (acc as { [key: string ] : string} );
                tempAcc[key] = ParseHelper.findByPath(parsedData, FonjepRequestEntity.indexedLegalInformationsPath[key]);
                return tempAcc;
            }, {} as unknown) as { siret: Siret, name: string };

            return entities.concat(new FonjepRequestEntity(legalInformations, indexedInformations, parsedData));
        }, [] as FonjepRequestEntity[]);
    }
}