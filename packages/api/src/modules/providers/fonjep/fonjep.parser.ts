import { Siret } from "@api-subventions-asso/dto"
import { DefaultObject } from "../../../@types";
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import IFonjepIndexedInformations from "./@types/IFonjepIndexedInformations";
import FonjepRequestEntity from "./entities/FonjepRequestEntity";

export default class FonjepParser {

    private static mapHeaderToData(pages: unknown[][]) {
        return pages.map(page => {
            const headers = (page.slice(0,1)[0] as string[]).map((h: string) => h.trim());
            const raws = page.slice(1, page.length) as (string|number)[][]; // Delete Headers 

            return raws.map(data => ParserHelper.linkHeaderToData(headers, data) as DefaultObject<string>);
        });
    }

    private static filterOnPropFactory(array: DefaultObject<string>[], prop: string) {
        return (match: string) => array.find(item => item[prop] === match)
    }

    private static createFonjepEntity(parsedData: DefaultObject<unknown>) {
        const indexedInformations = ParserHelper.indexDataByPathObject(FonjepRequestEntity.indexedProviderInformationsPath, parsedData) as unknown as IFonjepIndexedInformations;
        const legalInformations = ParserHelper.indexDataByPathObject(FonjepRequestEntity.indexedLegalInformationsPath, parsedData) as { siret: Siret, name: string };
        return new FonjepRequestEntity(legalInformations, indexedInformations, parsedData);
    }
    
    public static parse(fileContent: Buffer, exportDate: Date) {
        const pages = ParserHelper.xlsParse(fileContent);
        const currentDate = exportDate;

        const [tiers, postes, cofinancements, typePoste] = this.mapHeaderToData(pages);

        const findTiers = this.filterOnPropFactory(tiers, "Code");
        const findTypePoste = this.filterOnPropFactory(typePoste, "Code");
        const findCoFinancements = this.filterOnPropFactory(cofinancements, "PostCode");

        const createEntitiesByPostes = (entities: FonjepRequestEntity[], poste: DefaultObject<string>) => {
            const financeur = findTiers(poste["FinanceurAttributeurCode"]);
            const typePoste = findTypePoste(poste["PstTypePosteCode"]);
            const association = findTiers(poste["AssociationBeneficiaireCode"]);
            const uniqueId = `${poste["Code"]}-${ParserHelper.ExcelDateToJSDate(parseFloat(poste["DateFinTriennalite"])).toISOString()}`;
            
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

            return entities.concat(this.createFonjepEntity(parsedData));
        };

        return postes.reduce(createEntitiesByPostes, []);
    }
}