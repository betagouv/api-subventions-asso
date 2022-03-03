import ILeCompteAssoPartialRequestEntity from "./@types/ILeCompteAssoPartialRequestEntity";
import LeCompteAssoRequestEntity from "./entities/LeCompteAssoRequestEntity";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { Siret } from "../../../@types/Siret";
import ILeCompteAssoRequestInformations from "./@types/ILeCompteAssoRequestInformations";

export default class LeCompteAssoParser {
    public static parse(content: Buffer): ILeCompteAssoPartialRequestEntity[] {
        const data = ParseHelper.csvParse(content)
        const header = data[0];
        const raws = data.slice(1);
        return raws.reduce((entities, raw) => {
            if (!raw.map(column => column.trim()).filter(c => c).length) return entities;
            const parsedData = ParseHelper.linkHeaderToData(header, raw);
    
            const legalInformations = {
                ...ParseHelper.indexDataByPathObject(LeCompteAssoRequestEntity.indexedLegalInformationsPath, parsedData) as {siret: Siret, name: string},
                rna: null
            }

            const providerInformations = ParseHelper.indexDataByPathObject(LeCompteAssoRequestEntity.indexedProviderInformationsPath, parsedData) as ILeCompteAssoRequestInformations;


            entities.push({legalInformations, providerInformations, data: parsedData});

            return entities;

        }, [] as ILeCompteAssoPartialRequestEntity[]);
    }
}