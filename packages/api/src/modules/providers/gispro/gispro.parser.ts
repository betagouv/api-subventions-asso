import GisproRequestEntity from './entities/GisproRequestEntity';
import * as ParserHelper from '../../../shared/helpers/ParserHelper'
import IGisproRequestInformations from './@types/IGisproRequestInformations';
import ILegalInformations from '../../search/@types/ILegalInformations';
import { DefaultObject } from '../../../@types';
import ActionsPagesIndexer from './indexers/ActionsPagesIndexer';
import TiersPagesIndexer from './indexers/TiersPagesIndexer';
import ProjectsPagesIndexer from './indexers/ProjectsPagesIndexer';

export default class GisproParser {
    public static parseRequests(content: Buffer): GisproRequestEntity[] {
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
        const projetsPage = findPage("projets");
        const tiersPage = findPage("base .* tiers");

        console.log(actionsPage && actionsPage.name, projetsPage && projetsPage.name, tiersPage && tiersPage.name);
        if (!actionsPage) return [];

        const getTiers = (siret: unknown) => {
            if (!siret) return undefined;

            const action = actionsPage.data.find(raw => ParserHelper.findByPath(raw, ActionsPagesIndexer.siret) === siret);

            if (!action) return undefined;

            const tierAction = {
                "Tiers": ParserHelper.findByPath(action, ActionsPagesIndexer.Tiers),
                "Code SIRET": ParserHelper.findByPath(action, ActionsPagesIndexer.siret),
                "Tiers - Code": ParserHelper.findByPath(action, ActionsPagesIndexer['Tiers - Code']),
                "Type de tiers": ParserHelper.findByPath(action, ActionsPagesIndexer['Type de tiers']),
                "Adresse administrative - Adresse complète": ParserHelper.findByPath(action, ActionsPagesIndexer['Adresse administrative - Adresse complète']),
                "Libellé abrégé de la région": ParserHelper.findByPath(action, ActionsPagesIndexer['Libellé abrégé de la région']),
                "dépt": ParserHelper.findByPath(action, ActionsPagesIndexer.dépt),
            }

            if (tiersPage) {
                const tiers = tiersPage.data.find(raw => ParserHelper.findByPath(raw, TiersPagesIndexer.siret) === siret);
                if (tiers) return { ...tierAction, ...tiers};
            }

            return tierAction;
        }

        const getProject = (codeProjet: unknown) => {
            if (!codeProjet) return undefined;

            const action = actionsPage.data.find(raw => ParserHelper.findByPath(raw, ActionsPagesIndexer['Projet - Code dossier']) === codeProjet);

            if (!action) return undefined;

            const projectInAction = {
                'Projet - Code dossier': ParserHelper.findByPath(action, ActionsPagesIndexer['Projet - Code dossier']),
                'DR/DD/PN': ParserHelper.findByPath(action, ActionsPagesIndexer['DR/DD/PN']),
                'Région':  ParserHelper.findByPath(action, ActionsPagesIndexer.Région),
                'Projet' :  ParserHelper.findByPath(action, ActionsPagesIndexer.Projet),
                "Libellé de la procédure de l'action":  ParserHelper.findByPath(action, ActionsPagesIndexer['Libellé de la procédure de l\'action']),
                'libellé projet':  ParserHelper.findByPath(action, ActionsPagesIndexer['libellé projet']),
                'MT': ParserHelper.findByPath(action, ActionsPagesIndexer.MT),
            }

            if (projetsPage) {
                const project = projetsPage.data.find(raw => ParserHelper.findByPath(raw, ProjectsPagesIndexer['Projet - Code dossier']) === codeProjet);
                if (project) return { ...projectInAction, ...project};
            }

            return projectInAction;
        }

        const siret = ParserHelper.findByPath(actionsPage.data[0], ActionsPagesIndexer.siret);
        const codeProject = ParserHelper.findByPath(actionsPage.data[0], ActionsPagesIndexer['Projet - Code dossier']);

        console.log(getProject(codeProject));
        // console.log(getTiers(siret))


        return [];
        // const headers = data.slice(0,1).flat() as string[];
        // const raws = data.slice(1, data.length) as unknown[][]; // Delete Headers
        // return raws.map((raw) => {
        //     const data = ParserHelper.linkHeaderToData(headers, raw);
        //     const indexedInformations = ParserHelper.indexDataByPathObject(GisproRequestEntity.indexedProviderInformationsPath, data) as IGisproRequestInformations;
        //     const legalInformations = ParserHelper.indexDataByPathObject(GisproRequestEntity.indexedLegalInformationsPath, data) as unknown as ILegalInformations;
        //     return new GisproRequestEntity(legalInformations, indexedInformations, data);
        // });
    }
}