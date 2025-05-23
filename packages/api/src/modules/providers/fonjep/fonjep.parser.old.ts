import { SiretDto } from "dto";
import { DefaultObject, NestedDefaultObject } from "../../../@types";
import { GenericParser } from "../../../shared/GenericParser";
import IFonjepIndexedInformations from "./@types/IFonjepIndexedInformations";
import IFonjepPaymentIndexedInformations from "./@types/IFonjepPaymentIndexedInformations";
import FonjepSubventionEntity from "./entities/FonjepSubventionEntity.old";
import FonjepPaymentEntity from "./entities/FonjepPaymentEntity.old";
import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";

export default class FonjepParser {
    private static mapHeaderToData(pages: unknown[][]) {
        return pages.map(page => {
            const headers = page.slice(0, 1)[0] as string[];
            const trimHeaders = headers.map((h: string) => h.trim());

            const rows = page.slice(1, page.length) as (string | number)[][]; // Delete Headers

            return rows.map(data => GenericParser.linkHeaderToData(trimHeaders, data) as DefaultObject<string>);
        });
    }

    private static findOnPropFactory(array: DefaultObject<string>[], prop: string) {
        // TODO <string|number>
        if (!array) array = [];
        return (match: string | number | undefined) => array.find(item => item[prop] == match);
    }

    private static filterOnPropFactory(array: DefaultObject<string>[], prop: string) {
        // TODO <string|number>
        if (!array) array = [];
        return (match: string | number | undefined) => array.filter(item => item[prop] == match);
    }

    private static createFonjepSubventionEntity(parsedData: NestedDefaultObject<string>) {
        const indexedInformations = GenericParser.indexDataByPathObject(
            // TODO <string|number>
            FonjepSubventionEntity.indexedProviderInformationsPath,
            parsedData,
        ) as unknown as IFonjepIndexedInformations;
        indexedInformations.joinKey = indexedInformations.annee_demande + "-" + indexedInformations.code_poste;
        const legalInformations = GenericParser.indexDataByPathObject(
            FonjepSubventionEntity.indexedLegalInformationsPath,
            parsedData,
        ) as { siret: SiretDto; name: string };
        return new FonjepSubventionEntity(legalInformations, indexedInformations, parsedData);
    }

    private static createFonjepPaymentEntity(data: DefaultObject<string>) {
        const indexedInformations = GenericParser.indexDataByPathObject(
            // TODO <string|number>
            FonjepPaymentEntity.indexedProviderInformationsPath,
            data,
        ) as unknown as IFonjepPaymentIndexedInformations;
        indexedInformations.joinKey =
            indexedInformations.periode_debut.getFullYear() + "-" + indexedInformations.code_poste;
        const legalInformations = GenericParser.indexDataByPathObject(
            FonjepPaymentEntity.indexedLegalInformationsPath,
            data,
        ) as { siret: SiretDto };
        return new FonjepPaymentEntity(legalInformations, indexedInformations, data);
    }

    public static parse(fileContent: Buffer, exportDate: Date) {
        const pagesWithName = GenericParser.xlsParseByPageName(fileContent);
        const pages = [
            pagesWithName["Tiers"],
            pagesWithName["Poste"],
            pagesWithName["Versement"],
            pagesWithName["TypePoste"],
            pagesWithName["Dispositif"],
        ];
        const currentDate = exportDate;

        const [tiers, postes, payments, typePoste, dispositifs] = this.mapHeaderToData(pages);
        const findTiers = this.findOnPropFactory(tiers, "Code");
        const findTypePoste = this.findOnPropFactory(typePoste, "Code");
        const findDispositif = this.findOnPropFactory(dispositifs, "ID");
        const findPostes = this.filterOnPropFactory(postes, "Code");

        const createPayments = (payments: FonjepPaymentEntity[], payment) => {
            if (!payment["MontantPaye"] || !payment["DateVersement"]) return payments;

            const periodDebut = GenericParser.ExcelDateToJSDate(Number(payment["PeriodeDebut"]));

            // recupère le poste
            const postes = findPostes(payment["PosteCode"]);
            const poste = postes.find(poste => periodDebut.getFullYear() == (poste["Annee"] as unknown as number));
            if (!poste) return payments;

            const association = findTiers(poste["AssociationBeneficiaireCode"]);
            if (!association) return payments;

            const paymentId = `${association["SiretOuRidet"]}-${payment["PosteCode"]}-${periodDebut.toISOString()}`;

            payments.push(
                this.createFonjepPaymentEntity({
                    ...payment,
                    siret: association ? association["SiretOuRidet"] : undefined,
                    bop: FonjepEntityAdapter.getBopFromFounderCode(Number(poste["FinanceurPrincipalCode"])),
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
            }-${GenericParser.ExcelDateToJSDate(Number(poste["DateFinTriennalite"])).toISOString()}`;

            if (!currentDate || !financeur || !typePoste || !association || !dispositif) return subventions;

            subventions.push(
                this.createFonjepSubventionEntity({
                    ...poste,
                    id: uniqueSubventionId,
                    // @ts-expect-error -- updated_at value is not from the export and will not follow typing string|number typing
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
