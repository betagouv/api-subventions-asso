import LeCompteAssoPartialRequestEntity from "./entities/LeCompteAssoPartialRequestEntity";
import LeCompteAssoRequestEntity from "./entities/LeCompteAssoRequestEntity";

export default class LeCompteAssoParser {
    public static async parse(content: Buffer): Promise<LeCompteAssoPartialRequestEntity[]> {
        const data = content
            .toString()
            .split("\n") // Select line by line
            .map(raw => raw.split(";").map(r => r.split("\t")).flat()) // Parse column
        const header = data[0];
        const raws = data.slice(1);
        return await raws.reduce((entitiesPromise, raw) => {
            if (!raw.map(column => column.trim()).filter(c => c).length) return entitiesPromise;
            return entitiesPromise.then(async entities => {
                const parsedData = header.reduce((acc, header, key) => {
                    acc[header.trim()] = raw[key];
                    return acc;
                }, {} as {[key: string]: string});
    
                const legalInformations = {
                    siret: LeCompteAssoRequestEntity.indexedLegalInformationsPath.siret.reduce((acc, name) => {
                        return (acc as {[key: string]: unknown})[name];
                    }, parsedData as unknown) as string,
    
                    name: LeCompteAssoRequestEntity.indexedLegalInformationsPath.name.reduce((acc, name) => {
                        return (acc as {[key: string]: unknown})[name];
                    }, parsedData as unknown) as string,
                    rna: null
                }
    
                const providerInformations = {
                    compteAssoId: LeCompteAssoRequestEntity.indexedProviderInformationsPath.compteAssoId.reduce((acc, name) => {
                        return (acc as {[key: string]: unknown})[name.trim()];
                    }, parsedData as unknown) as string,
                };

                entities.push({legalInformations, providerInformations, data: parsedData});
                
                return entities;
            });

        }, Promise.resolve([]) as Promise<LeCompteAssoPartialRequestEntity[]>);
    }
}