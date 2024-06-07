import { Siret } from "dto";
import { DefaultObject } from "../../../@types";
import * as ParserHelper from "../../../shared/helpers/ParserHelper";
import IFonjepIndexedInformations from "./@types/IFonjepIndexedInformations";
import IFonjepVersementIndexedInformations from "./@types/IFonjepPaymentIndexedInformations";
import FonjepSubventionEntity from "./entities/FonjepSubventionEntity";
import FonjepPaymentEntity from "./entities/FonjepPaymentEntity";
import fonjepService from "./fonjep.service";

export default class FonjepParser {
    private static mapHeaderToData(pages: unknown[][]) {
        return pages.map(page => {
            const headers = page.slice(0, 1)[0] as string[];
            const trimHeaders = headers.map((h: string) => h.trim());

            const rows = page.slice(1, page.length) as (string | number)[][]; // Delete Headers

            return rows.map(data => ParserHelper.linkHeaderToData(trimHeaders, data) as DefaultObject<string>);
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

    private static createFonjepPaymentEntity(data: DefaultObject<unknown>) {
        const indexedInformations = ParserHelper.indexDataByPathObject(
            FonjepPaymentEntity.indexedProviderInformationsPath,
            data,
        ) as unknown as IFonjepVersementIndexedInformations;
        const legalInformations = ParserHelper.indexDataByPathObject(
            FonjepPaymentEntity.indexedLegalInformationsPath,
            data,
        ) as { siret: Siret };
        return new FonjepPaymentEntity(legalInformations, indexedInformations, data);
    }

    public static parse(fileContent: Buffer, exportDate: Date) {
        const pages = ParserHelper.xlsParse(fileContent);
        const currentDate = exportDate;

        const [tiers, postes, payments, typePoste, dispositifs] = this.mapHeaderToData(pages);
        console.log(payments);
        const findTiers = this.findOnPropFactory(tiers, "Code");
        const findTypePoste = this.findOnPropFactory(typePoste, "Code");
        const findDispositif = this.findOnPropFactory(dispositifs, "ID");
        const findPostes = this.filterOnPropFactory(postes, "Code");

        const createPayments = (payments: FonjepPaymentEntity[], payment) => {
            if (!payment["MontantPaye"] || !payment["DateVersement"]) return payments;

            const periodDebut = ParserHelper.ExcelDateToJSDate(Number(payment["PeriodeDebut"]));

            // recupère le poste
            const postes = findPostes(payment["PosteCode"]);
            const poste = postes.find(poste => periodDebut.getFullYear() == poste["Annee"]);
            if (!poste) return payments;

            const association = findTiers(poste["AssociationBeneficiaireCode"]);
            if (!association) return payments;

            const paymentId = `${association["SiretOuRidet"]}-${payment["PosteCode"]}-${periodDebut.toISOString()}`;

            payments.push(
                this.createFonjepPaymentEntity({
                    ...payment,
                    siret: association ? association["SiretOuRidet"] : undefined,
                    bop: fonjepService.getBopFromFounderCode(Number(poste["FinanceurPrincipalCode"])),
                    updated_at: currentDate,
                    id: paymentId,
                }),
            );
            return payments;
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
            payments: payments.reduce(createPayments, []),
        };
    }
}
