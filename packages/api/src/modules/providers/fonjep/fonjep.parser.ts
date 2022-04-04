import { DefaultObject, Siret } from "../../../@types";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import IFonjepIndexedInformations from "./@types/IFonjepIndexedInformations";
import FonjepRequestEntity from "./entities/FonjepRequestEntity";

export default class FonjepParser {
    public static parse(fileContent: Buffer) {
        const pages = ParseHelper.xlsParse(fileContent);
        const currentDate = new Date();

        const [tiers, postes, cofinancements, typePoste] = pages.map(page => {
            const headers = (page.slice(0,1)[0] as string[]).map((h: string) => h.trim());
            const raws = page.slice(1, page.length) as (string|number)[][]; // Delete Headers 

            return raws.map(data => ParseHelper.linkHeaderToData(headers, data as string[]));
        });

        const findTiers = (codeTier: string) => tiers.find(tier => tier["Code"] === codeTier);
        const findTypePoste = (codeTypePoste: string) => typePoste.find(poste => poste["Code"] === codeTypePoste);
        const findCoFinancements = (codePoste: string) => cofinancements.find(cofinancement => cofinancement["PosteCode"] === codePoste);
        const buildUniqueId = (poste: DefaultObject<string>) => `${poste["Code"]}-${ParseHelper.ExcelDateToJSDate(parseFloat(poste["DateFinTriennalite"]))}`;

        const createEntitiesByPostes = (entities: FonjepRequestEntity[], poste: DefaultObject<string>) => {
            const financeur = findTiers(poste["FinanceurAttributeurCode"]);
            const typePoste = findTypePoste(poste["PstTypePosteCode"]);
            const association = findTiers(poste["AssociationBeneficiaireCode"]);
            const uniqueId = buildUniqueId(poste);
            
            let cofinanceur: DefaultObject<string> | undefined;
            const coFinancements = findCoFinancements(poste["Code"]);
            if (coFinancements) cofinanceur = findTiers(coFinancements["TiersCode"]);

            const parsedData = {
                ...poste,
                Financeur: financeur,
                "Co-Financeur": cofinanceur,
                "Co-Financements": coFinancements,
                TypePoste: typePoste,
                Association: association,
                id: uniqueId,
                updated_at: currentDate
            };

            const indexedInformations = ParseHelper.indexDataByPathObject(FonjepRequestEntity.indexedProviderInformationsPath, parsedData) as unknown as IFonjepIndexedInformations;
            const legalInformations = ParseHelper.indexDataByPathObject(FonjepRequestEntity.indexedLegalInformationsPath, parsedData) as { siret: Siret, name: string };

            return entities.concat(new FonjepRequestEntity(legalInformations, indexedInformations, parsedData));
        };

        return postes.reduce(createEntitiesByPostes, []);
    }
}