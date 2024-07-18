import { Siret } from "dto";
import { GenericParser } from "../../../shared/GenericParser";
import ILeCompteAssoPartialRequestEntity from "./@types/ILeCompteAssoPartialRequestEntity";
import LeCompteAssoRequestEntity from "./entities/LeCompteAssoRequestEntity";
import ILeCompteAssoRequestInformations from "./@types/ILeCompteAssoRequestInformations";

export default class LeCompteAssoParser {
    public static parse(content: Buffer): ILeCompteAssoPartialRequestEntity[] {
        const data = GenericParser.csvParse(content, "\t");
        const header = data[0].map(h => h.trim());
        const rows = data.slice(1);
        return rows.reduce((entities, row) => {
            if (!row.map(column => column.trim()).filter(c => c).length) return entities;
            const parsedData = GenericParser.linkHeaderToData(header, row);

            const legalInformations = {
                ...(GenericParser.indexDataByPathObject(
                    // TODO <string|number> ??
                    LeCompteAssoRequestEntity.indexedLegalInformationsPath,
                    parsedData,
                ) as { siret: Siret; name: string }),
                rna: null,
            };

            const providerInformations = GenericParser.indexDataByPathObject(
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
