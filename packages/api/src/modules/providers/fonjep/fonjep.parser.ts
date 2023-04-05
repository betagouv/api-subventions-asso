import { Siret } from "@api-subventions-asso/dto";
import { DefaultObject } from "../../../@types";
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import IFonjepIndexedInformations from "./@types/IFonjepIndexedInformations";
import IFonjepVersementIndexedInformations from "./@types/IFonjepVersementIndexedInformations";
import FonjepSubventionEntity from "./entities/FonjepSubventionEntity";
import FonjepVersementEntity from "./entities/FonjepVersementEntity";

export default class FonjepParser {
    private static mapHeaderToData(pages: unknown[][]) {
        return pages.map(page => {
            const headers = page.slice(0, 1)[0] as string[];
            const trimHeaders = headers.map((h: string) => h.trim());

            const raws = page.slice(1, page.length) as (string | number)[][]; // Delete Headers

            return raws.map(data => ParserHelper.linkHeaderToData(trimHeaders, data) as DefaultObject<string>);
        });
    }

    private static findOnPropFactory(array: DefaultObject<string | number>[], prop: string) {
        if (!array) array = [];
        return (match: string | number | undefined) => array.find(item => item[prop] == match);
    }

    private static filterOnPropFactory(array: DefaultObject<string | number>[], prop: string) {
        if (!array) array = [];
        return (match: string | number | undefined) => array.filter(item => item[prop] == match);
    }

    private static createFonjepSubventionEntity(parsedData: DefaultObject<unknown>) {
        const indexedInformations = ParserHelper.indexDataByPathObject(
            FonjepSubventionEntity.indexedProviderInformationsPath,
            parsedData,
        ) as unknown as IFonjepIndexedInformations;
        const legalInformations = ParserHelper.indexDataByPathObject(
            FonjepSubventionEntity.indexedLegalInformationsPath,
            parsedData,
        ) as { siret: Siret; name: string };
        return new FonjepSubventionEntity(legalInformations, indexedInformations, parsedData);
    }

    private static createFonjepVersementEntity(data: DefaultObject<unknown>) {
        const indexedInformations = ParserHelper.indexDataByPathObject(
            FonjepVersementEntity.indexedProviderInformationsPath,
            data,
        ) as unknown as IFonjepVersementIndexedInformations;
        const legalInformations = ParserHelper.indexDataByPathObject(
            FonjepVersementEntity.indexedLegalInformationsPath,
            data,
        ) as { siret: Siret };
        return new FonjepVersementEntity(legalInformations, indexedInformations, data);
    }

    public static parse(fileContent: Buffer, exportDate: Date) {
        const pages = ParserHelper.xlsParse(fileContent);
        const currentDate = exportDate;

        const [tiers, postes, versements, typePoste, dispositifs] = this.mapHeaderToData(pages);
        const findTiers = this.findOnPropFactory(tiers, "Code");
        const findTypePoste = this.findOnPropFactory(typePoste, "Code");
        const findDispositif = this.findOnPropFactory(dispositifs, "ID");
        const findPostes = this.filterOnPropFactory(postes, "Code");

        const createVersements = (versements: FonjepVersementEntity[], versement) => {
            if (!versement["MontantPaye"] || !versement["DateVersement"]) return versements;

            const periodDebut = ParserHelper.ExcelDateToJSDate(Number(versement["PeriodeDebut"]));

            // recupère le poste
            const postes = findPostes(versement["PosteCode"]);
            const poste = postes.find(poste => periodDebut.getFullYear() == poste["Annee"]);
            if (!poste) return versements;

            const association = findTiers(poste["AssociationBeneficiaireCode"]);
            if (!association) return versements;

            const versementId = `${association["SiretOuRidet"]}-${versement["PosteCode"]}-${periodDebut.toISOString()}`;

            versements.push(
                this.createFonjepVersementEntity({
                    ...versement,
                    siret: association ? association["SiretOuRidet"] : undefined,
                    updated_at: currentDate,
                    id: versementId,
                }),
            );
            return versements;
        };

        const createSubventions = (
            subventions: FonjepSubventionEntity[],
            poste: DefaultObject<string | number | undefined>,
        ) => {
            const financeur = findTiers(poste["FinanceurAttributeurCode"]);
            const typePoste = findTypePoste(poste["PstTypePosteCode"]);
            const association = findTiers(poste["AssociationBeneficiaireCode"]);
            if (!association) return subventions;
            const dispositif = findDispositif(poste["DispositifId"]);
            const uniqueSubventionId = `${association["SiretOuRidet"]}-${
                poste["Code"]
            }-${ParserHelper.ExcelDateToJSDate(Number(poste["DateFinTriennalite"])).toISOString()}`;

            subventions.push(
                this.createFonjepSubventionEntity({
                    ...poste,
                    id: uniqueSubventionId,
                    updated_at: currentDate,
                    Financeur: financeur,
                    TypePoste: typePoste,
                    Association: association,
                    Dispositif: dispositif,
                }),
            );
            return subventions;
        };

        return {
            subventions: postes.reduce(createSubventions, []),
            versements: versements.reduce(createVersements, []),
        };
    }
}
