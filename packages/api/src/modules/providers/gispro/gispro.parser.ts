import * as ParserHelper from '../../../shared/helpers/ParserHelper'
import { DefaultObject } from '../../../@types';
import ActionsPagesIndexer from './indexers/ActionsPagesIndexer';
import TiersPagesIndexer from './indexers/TiersPagesIndexer';
import GisproActionEntity from './entities/GisproActionEntity';
import IGisproActionInformations from './@types/IGisproActionInformations';

export default class GisproParser {
    public static parseActions(content: Buffer): GisproActionEntity[] {
        const importedDate = new Date();
        const pages = ParserHelper.xlsParseWithPageName(content);

        const pagesWithHeader = pages.reduce((acc, page) => {
            const headers = page.data.slice(0,1).flat() as string[];
            const raws = page.data.slice(1, page.data.length) as unknown[][];
            return acc.concat({
                name: page.name,
                data: raws.map((raw) =>  ParserHelper.linkHeaderToData(headers, raw))
            })
        }, [] as {name: string, data: DefaultObject<unknown>[]}[]);

        const findPage = (query: string | RegExp) => pagesWithHeader.find(p => p.name.match(query));

        const actionsPage = findPage(/(actions)|(base 2016 GISPRO)/);

        if (!actionsPage) return [];

        const tiersPage = findPage(/(CUMUL PAR .* TIERS)|(CUMUL PAR ORG)|(CUMUL ORGANISME)|(base .* tiers)/);

        const getUniformatedTier = (siret: unknown): undefined | { siret: string | number, CodeTiers: string | number, Tiers: string, TypeTiers: string} => {
            if (!siret || !tiersPage) return undefined;

            const tiers = tiersPage.data.find(raw => ParserHelper.findByPath(raw, TiersPagesIndexer.siret) === siret);
            if (tiers) return {
                siret: ParserHelper.findByPath(tiers, TiersPagesIndexer.siret),
                "CodeTiers": ParserHelper.findByPath(tiers, TiersPagesIndexer.CodeTiers),
                Tiers: ParserHelper.findByPath(tiers, TiersPagesIndexer.Tiers),
                "TypeTiers": ParserHelper.findByPath(tiers, TiersPagesIndexer.TypeTiers)
            };
        }

        return actionsPage.data.reduce((acc, actionLine) => {
            const parsedData = ParserHelper.indexDataByPathObject(ActionsPagesIndexer, actionLine);
            const tier = getUniformatedTier(parsedData.siret);
            const raw = {
                tier,
                action: parsedData,
                generated: {
                    importedDate
                }
            }

            const indexedInformations = ParserHelper.indexDataByPathObject(GisproActionEntity.indexedProviderInformationsPath, raw) as unknown as IGisproActionInformations;

            return acc.concat([
                new GisproActionEntity(indexedInformations, raw)
            ]);
        }, [] as GisproActionEntity[]);
    }
}