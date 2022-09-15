import { Siret } from "@api-subventions-asso/dto"
import { DefaultObject } from "../../../@types";
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import IFonjepIndexedInformations from "./@types/IFonjepIndexedInformations";
import IFonjepVersementIndexedInformations from "./@types/IFonjepVersementIndexedInformations";
import FonjepSubventionEntity from "./entities/FonjepSubventionEntity";
import FonjepVersementEntity from "./entities/FonjepVersementEntity";

export interface FonjepRowData {
    subvention: FonjepSubventionEntity, versements: FonjepVersementEntity[]
}

export default class FonjepParser {

    private static mapHeaderToData(pages: unknown[][]) {
        return pages.map(page => {
            const headers = page.slice(0, 1)[0] as string[];
            const trimHeaders = headers.map((h: string) => h.trim());

            const raws = page.slice(1, page.length) as (string | number)[][]; // Delete Headers 

            return raws.map(data => ParserHelper.linkHeaderToData(trimHeaders, data) as DefaultObject<string>);
        });
    }

    private static filterOnPropFactory(array: DefaultObject<string>[], prop: string) {
        if (!array) array = [];
        return (match: string) => array.find(item => String(item[prop]) === String(match))
    }

    private static createFonjepEntity(parsedData: DefaultObject<unknown>) {
        const indexedInformations = ParserHelper.indexDataByPathObject(FonjepSubventionEntity.indexedProviderInformationsPath, parsedData) as unknown as IFonjepIndexedInformations;
        const legalInformations = ParserHelper.indexDataByPathObject(FonjepSubventionEntity.indexedLegalInformationsPath, parsedData) as { siret: Siret, name: string };
        return new FonjepSubventionEntity(legalInformations, indexedInformations, parsedData);
    }

    private static createFonjepVersementEntity(data: DefaultObject<unknown>) {
        const indexedInformations = ParserHelper.indexDataByPathObject(FonjepVersementEntity.indexedProviderInformationsPath, data) as unknown as IFonjepVersementIndexedInformations;
        const legalInformations = ParserHelper.indexDataByPathObject(FonjepVersementEntity.indexedLegalInformationsPath, data) as { siret: Siret }
        return new FonjepVersementEntity(legalInformations, indexedInformations, data);
    }

    public static parse(fileContent: Buffer, exportDate: Date) {
        const pages = ParserHelper.xlsParse(fileContent);
        const currentDate = exportDate;

        const [tiers, postes, versements, typePoste, dispositifs] = this.mapHeaderToData(pages);

        const findTiers = this.filterOnPropFactory(tiers, "Code");
        const findTypePoste = this.filterOnPropFactory(typePoste, "Code");
        const findDispositif = this.filterOnPropFactory(dispositifs, "ID");

        const createEntitiesByPostes = (result: { subvention: FonjepSubventionEntity, versements: FonjepVersementEntity[] }[], poste: DefaultObject<string>) => {
            const financeur = findTiers(poste["FinanceurAttributeurCode"]);
            const typePoste = findTypePoste(poste["PstTypePosteCode"]);
            const association = findTiers(poste["AssociationBeneficiaireCode"]);
            const dispositif = findDispositif(poste["DispositifId"]);
            const subventionVersements = versements.filter(versement =>
                versement["PosteCode"] == poste["Code"] && ParserHelper.ExcelDateToJSDate(Number(versement["PeriodeDebut"])).getFullYear() == Number(poste["Annee"])
            );
            const uniqueSubventionId = `${poste["Code"]}-${ParserHelper.ExcelDateToJSDate(parseFloat(poste["DateFinTriennalite"])).toISOString()}`;

            const subventionParsedData = {
                ...poste,
                id: uniqueSubventionId,
                updated_at: currentDate,
                Financeur: financeur,
                TypePoste: typePoste,
                Association: association,
                Dispositif: dispositif
            };

            const versementsParsedData = subventionVersements.map(versement => {
                return {
                    ...versement,
                    siret: association ? association["SiretOuRidet"] : undefined,
                    updated_at: currentDate,
                    id: `${uniqueSubventionId}-${ParserHelper.ExcelDateToJSDate(Number(versement["PeriodeDebut"])).toISOString()}`
                }
            });

            const subventionEntity = this.createFonjepEntity(subventionParsedData);
            const versementEntities = versementsParsedData.map(versement => this.createFonjepVersementEntity(versement));
            result.push({ subvention: subventionEntity, versements: versementEntities });
            return result;
        };

        return postes.reduce(createEntitiesByPostes, []);
    }
}