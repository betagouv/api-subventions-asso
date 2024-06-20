import { shortISORegExp } from "../../../shared/helpers/DateHelper";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import { ScdlGrantSchema } from "./@types/ScdlGrantSchema";

const OFFICIAL_MAPPER = {
    exercice: "exercice",
    conventionDate: "dateConvention",
    decisionReference: "referenceDecision",
    associationName: "nomBeneficiaire",
    associationSiret: "idBeneficiaire",
    associationRna: "rnaBeneficiaire",
    object: "object",
    amount: "montant",
    paymentNature: "nature",
    paymentConditions: "conditionsVersement",
    paymentStartDate: "datesPeriodeVersement",
    paymentEndDate: "datesPeriodeVersement",
    idRAE: "idRAE",
    UeNotification: "notificationUE",
    grantPercentage: "pourcentageSubvention",
    aidSystem: "dispositifAide",
};

function getMapperVariants(prop): string[] {
    const header = OFFICIAL_MAPPER[prop];
    return [header, header.toLowerCase(), header.toUpperCase()];
}

const expandedShortISOPeriodRegExp = /\d{4}-[01]\d-[0-3]\d[/_]\d{4}-[01]\d-[0-3]\d/;

const CONVENTION_DATE_PATHS = [...getMapperVariants("conventionDate"), "datedeconvention", "Date de convention*"];

const dateAdapter = (date: string | number | Date | undefined | null): Date | undefined => {
    if (!date) return undefined;
    if (date instanceof Date && !isNaN(date.getTime())) return date;
    if (typeof date === "string" || date instanceof String) return new Date(date);
    return ParseHelper.ExcelDateToJSDate(Number(date));
};

export const SCDL_MAPPER: ScdlGrantSchema = {
    exercice: {
        // for now if no exercise column we will use conventionDate as default
        path: [
            [
                ...getMapperVariants("exercice"),
                "Date de la convention",
                "dateDecision_Tri",
                "annee",
                "Année budgétaire",
                ...CONVENTION_DATE_PATHS,
            ],
        ],
        adapter: value => dateAdapter(value)?.getFullYear(),
    },
    conventionDate: {
        path: [["Date de la convention", ...CONVENTION_DATE_PATHS]],
        adapter: dateAdapter,
    },
    decisionReference: [[...getMapperVariants("decisionReference"), "Référence de la décision"]],
    associationName: [
        [...getMapperVariants("associationName"), "Nom du bénéficiaire*", "Nom Bénéficiaire", "NOM Bénéficiaire"],
    ],
    associationSiret: [
        [...getMapperVariants("associationSiret"), "Identification du bénéficiaire*", "Numéro Siret", "N° SIRET"],
    ],
    associationRna: [[...getMapperVariants("associationRna")]],
    object: [
        [
            ...getMapperVariants("object"),
            "objet",
            "Objet de la convention",
            "Objet du dossier",
            "Objet de la subvention",
        ],
    ],
    amount: {
        path: [
            [
                ...getMapperVariants("amount"),
                "Montant total de la subvention*",
                "Montant total de la subvention",
                "Montant voté",
            ],
        ],
        adapter: value => (value ? parseFloat(value) : value),
    },
    paymentNature: [[...getMapperVariants("paymentNature"), "Nature de la subvention"]],
    paymentConditions: [
        [...getMapperVariants("paymentConditions"), "Conditions de versement*", "Conditions de versement"],
    ],
    paymentStartDate: {
        path: [
            [
                ...getMapperVariants("paymentStartDate"),
                "Date de versement",
                "dateperiodedeversement",
                "dateperiodedversement",
                "Date(s) ou période(s) de versement",
            ],
        ],
        // @ts-expect-error: with undefined it returns false, so we don't need to check it
        adapter: value => (shortISORegExp.test(value) ? new Date(value.split(/[/_]/)[0].trim()) : dateAdapter(value)),
    },
    paymentEndDate: {
        path: [[...getMapperVariants("paymentEndDate"), "Date de versement", "dateperiodedversement"]],
        adapter: value => {
            const noSpaceValue = value?.replaceAll(" ", "");
            // @ts-expect-error: with undefined it returns false, so we don't need to check it
            if (expandedShortISOPeriodRegExp.test(noSpaceValue)) return new Date(noSpaceValue.split(/[/_]/)[1].trim());
            // @ts-expect-error: with undefined it returns false, so we don't need to check it
            else if (shortISORegExp.test(noSpaceValue)) return new Date(noSpaceValue);
            else return null;
        },
    },
    idRAE: [
        [
            ...getMapperVariants("idRAE"),
            "Numéro de référencement au répertoire des entreprises",
            "Numéro de référencement au répertoire des entreprises",
        ],
    ],
    UeNotification: {
        path: [
            [
                ...getMapperVariants("UeNotification"),
                "Aide notifiée Ã  l'Europe",
                "Aides ne relevant pas d'une aide d'état",
            ],
        ],
        adapter: value => {
            if (value?.toLowerCase() === "oui") return true;
            if (value?.toLowerCase() === "non") return false;
            return undefined;
        },
    },
    grantPercentage: {
        path: [
            [
                ...getMapperVariants("grantPercentage"),
                "Pourcentage du montant de la subvention attribué au bénéficiaire*",
                "% du mt de la subvention attribuée au bénéficiaire",
            ],
        ],
        adapter: value => (value ? parseFloat(value) : value),
    },
    aidSystem: [[...getMapperVariants("aidSystem")]],
};
