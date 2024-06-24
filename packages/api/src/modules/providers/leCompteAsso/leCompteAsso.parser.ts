import { Siret } from "dto";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import ILeCompteAssoPartialRequestEntity from "./@types/ILeCompteAssoPartialRequestEntity";
import LeCompteAssoRequestEntity from "./entities/LeCompteAssoRequestEntity";
import ILeCompteAssoRequestInformations from "./@types/ILeCompteAssoRequestInformations";

export default class LeCompteAssoParser {
    public static parse(content: Buffer): ILeCompteAssoPartialRequestEntity[] {
        const data = ParseHelper.csvParse(content, "\t");
        const header = data[0].map(h => h.trim());
        const rows = data.slice(1);
        return rows.reduce((entities, row) => {
            if (!row.map(column => column.trim()).filter(c => c).length) return entities;
            const parsedData = ParseHelper.linkHeaderToData(header, row);

            const legalInformations = {
                ...(ParseHelper.indexDataByPathObject(
                    // TODO <string|number> ??
                    LeCompteAssoRequestEntity.indexedLegalInformationsPath,
                    parsedData,
                ) as { siret: Siret; name: string }),
                rna: null,
            };

            const providerInformations = ParseHelper.indexDataByPathObject(
                LeCompteAssoRequestEntity.indexedProviderInformationsPath, // TODO <string|number> ??
                parsedData,
            ) as ILeCompteAssoRequestInformations;

            entities.push({
                legalInformations,
                providerInformations,
                data: parsedData,
            });

            return entities;
        }, [] as ILeCompteAssoPartialRequestEntity[]);
    }
}
