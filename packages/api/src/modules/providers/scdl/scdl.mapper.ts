import { getShortISODate, isValidDate, shortISORegExp } from "../../../shared/helpers/DateHelper";
import { GenericParser } from "../../../shared/GenericParser";
import { BeforeAdaptation } from "../../../@types";
import { ScdlGrantSchema } from "./@types/ScdlGrantSchema";
import { capitalizeFirstLetter } from "../../../shared/helpers/StringHelper";

const OFFICIAL_MAPPER = {
    allocatorName: "nomAttribuant",
    allocatorSiret: "idAttribuant",
    exercice: "exercice",
    conventionDate: "dateConvention",
    decisionReference: "referenceDecision",
    associationName: "nomBeneficiaire",
    associationSiret: "idBeneficiaire",
    associationRna: "rnaBeneficiaire",
    object: "object",
    amount: "montant",
    paymentNature: "Nature",
    paymentConditions: "conditionsVersement",
    paymentStartDate: "datesPeriodeVersement",
    paymentEndDate: "datesPeriodeVersement",
    idRAE: "idRAE",
    UeNotification: "notificationUE",
    grantPercentage: "pourcentageSubvention",
    aidSystem: "dispositifAide",
};

function getMapperVariants(prop): string[] {
    const header = OFFICIAL_MAPPER[prop] as string;
    return [header, header.toLowerCase(), header.toUpperCase(), capitalizeFirstLetter(header)];
}

const expandedShortISOPeriodRegExp = /\d{4}-[01]\d-[0-3]\d[/_]\d{4}-[01]\d-[0-3]\d/;

const CONVENTION_DATE_PATHS = [
    ...getMapperVariants("conventionDate"),
    "datedeconvention",
    "Date de convention*",
    "Date de la convention",
    "Date de la convention de subvention (AAAA-MM-JJ)",
    "date Convention",
    "DateConvention",
    "datedeConvention",
    "Date convention",
    "Date - Décision",
];

const PERIODE_VERSEMENT_PATHS = [
    "Date de versement",
    "dateperiodedeversement",
    "dateperiodedversement",
    "Date(s) ou période(s) de versement",
    "Date(s) ou période(s) de versement (AAAA-MM-JJ)",
    "dates Periode Versement",
    "datesPériodeVersement",
    "Date de versement",
    "Période de versement",
    "datesperiodeVersement",
];

const dateAdapter = (date: BeforeAdaptation | undefined | null): Date | undefined => {
    if (!date) return undefined;
    if (typeof date === "string") return new Date(date);
    return GenericParser.ExcelDateToJSDate(Number(date));
};

const cleanSiret = value => {
    let workingValue = value;
    workingValue = workingValue.replaceAll(/\s/g, "");
    if (workingValue?.includes(".")) {
        return workingValue.split(".")[0]; // Fix to remove ".0" from IDs when the CSV comes from a cell formatted as a float
    }
    if (workingValue.length < 14 && workingValue.length > 9) workingValue = workingValue.padStart(14, "0"); // puts zéros that could have been lost through number typing
    return workingValue;
};

export const SCDL_MAPPER: ScdlGrantSchema = {
    allocatorName: {
        path: [
            [
                ...getMapperVariants("allocatorName"),
                "Nom de l'attribuant",
                "nom Attribuant",
                "NomAttribuant",
                "Autorité administrative",
                "Nom attribuant",
            ],
        ],
    },
    allocatorSiret: {
        path: [
            [
                ...getMapperVariants("allocatorSiret"),
                "Identification de l'attribuant (SIRET)",
                "id  Attribuant",
                "IdAttribuant",
                "SIRET autorité administrative",
                "iAttribuant",
                "Id attribuant",
            ],
        ],
        adapter: v => cleanSiret(v?.toString()),
    },
    exercice: {
        // for now if no exercise column we will use conventionDate as default
        path: [
            [
                "Année de la demande",
                ...getMapperVariants("exercice"),
                "dateDecision_Tri",
                "annee",
                "Année budgétaire",
                "anneeConvention",
                "anneeDecision",
                ...CONVENTION_DATE_PATHS,
            ],
        ],
        adapter: value => {
            if (!value) return undefined;
            if (value.toString().length === 4) return Number(value);
            return dateAdapter(value)?.getFullYear();
        },
    },
    conventionDate: {
        path: [[...CONVENTION_DATE_PATHS]],
        adapter: dateAdapter,
    },
    decisionReference: {
        path: [
            [
                ...getMapperVariants("decisionReference"),
                "Référence de la décision",
                "reference Decision",
                "Référence délibération",
                "ReferenceDecision",
                "Référence décision 1",
            ],
        ],
        // difficult to test if number will be an excel date or a simple number as decisionReference format has no standard
        // a limit has been set to 2018 to current year for excel date to avoid transforming real number in date
        adapter: value => {
            if (!value) return undefined;
            // sometimes convention date is a date in excel format (number type)
            if (typeof value === "number") {
                const date = GenericParser.ExcelDateToJSDate(value);
                const year = date.getFullYear();
                if (year >= 2018 && year <= new Date().getFullYear()) {
                    return getShortISODate(date);
                } else return value;
            } else return value;
        },
    },
    associationName: [
        [
            ...getMapperVariants("associationName"),
            "Nom du bénéficiaire*",
            "Nom Bénéficiaire",
            "NOM Bénéficiaire",
            "Nom du bénéficiaire",
            "nom Beneficiaire",
            "nomBénéficiaire",
            "Nom attributaire",
            "NomBeneficiaire",
            "Nom bénéficiaire",
        ],
    ],
    associationSiret: {
        path: [
            [
                ...getMapperVariants("associationSiret"),
                "Identification du bénéficiaire*",
                "Numéro Siret",
                "N° SIRET",
                "identification du bénéficiaire (SIRET)",
                "id Beneficiaire",
                "IdBeneficiaire",
                "Id du bénéficiaire",
                "N° SIRET attributaire",
                "iBeneficiaire",
                "Id bénéficiaire",
                "SIRET du bénéficiaire",
            ],
        ],
        adapter: v => cleanSiret(v?.toString()),
    },
    associationRna: [[...getMapperVariants("associationRna")]],
    object: [
        [
            ...getMapperVariants("object"),
            "objet",
            "Objet",
            "Objet de la convention",
            "Objet du dossier",
            "Objet de la subvention",
            "Objet de l'aide",
            "Objet convention",
            "Nom du Projet",
        ],
    ],
    amount: {
        path: [
            [
                ...getMapperVariants("amount"),
                "Montant",
                "Montant total de la subvention*",
                "Montant total de la subvention",
                "Montant voté",
                "Montant décidé ligne",
                "Montant accordé",
                "montantAttribue",
            ],
        ],
        adapter: value => (value && typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/, "")) : value),
    },
    paymentNature: [
        [...getMapperVariants("paymentNature"), "Nature de la subvention", "Nature de l'aide", "Nature subvention"],
    ],
    paymentConditions: [
        [
            ...getMapperVariants("paymentConditions"),
            "Conditions de versement*",
            "Conditions de versement",
            "conditions Versement",
            "conditionVersement",
            "ConditionsVersement",
        ],
    ],
    paymentStartDate: {
        path: [[...getMapperVariants("paymentStartDate"), ...PERIODE_VERSEMENT_PATHS]],
        adapter: value => {
            // @ts-expect-error: with undefined it returns false, so we don't need to check it
            const parsedDate = shortISORegExp.test(value)
                ? // @ts-expect-error: idem
                  new Date(value.split(/[/_]/)[0].trim())
                : dateAdapter(value);
            return isValidDate(parsedDate) ? parsedDate : null;
        },
    },
    paymentEndDate: {
        path: [[...getMapperVariants("paymentEndDate"), ...PERIODE_VERSEMENT_PATHS]],
        adapter: value => {
            if (typeof value !== "string") {
                return dateAdapter(value);
            }
            let parsedDate: Date | null = null;
            const noSpaceValue = value?.replaceAll(" ", "");
            if (expandedShortISOPeriodRegExp.test(noSpaceValue)) {
                parsedDate = new Date(noSpaceValue.split(/[/_]/)[1].trim());
            } else if (shortISORegExp.test(noSpaceValue)) {
                parsedDate = new Date(noSpaceValue);
            }
            return isValidDate(parsedDate) ? parsedDate : null;
        },
    },
    idRAE: [
        [
            ...getMapperVariants("idRAE"),
            "Numéro de référencement au répertoire des entreprises",
            "Numéro de référencement au répertoire des entreprises",
            "Numéro unique de référencement au répertoire des aides aux entreprises (RAE)",
            "ID RAE",
            "IdRAE",
        ],
    ],
    UeNotification: {
        path: [
            [
                ...getMapperVariants("UeNotification"),
                "Aide notifiée Ã  l'Europe",
                "Aides ne relevant pas d'une aide d'état",
                "Aide d'Etat notifiée à la Commission européenne, conformément aux dispositions du règlement (UE) n° 1407/2013 de la Commission du 18 décembre 2013",
                "Notification UE",
                "NotificationUE",
            ],
        ],
        adapter: value => {
            if (typeof value === "number") return !!value;
            if (typeof value !== "string") return undefined;
            if (["oui", "true"].includes(value?.toLowerCase())) return true;
            if (["non", "false"].includes(value?.toLowerCase())) return false;
            return undefined;
        },
    },
    grantPercentage: {
        path: [
            [
                ...getMapperVariants("grantPercentage"),
                "Pourcentage du montant de la subvention attribué au bénéficiaire*",
                "% du mt de la subvention attribuée au bénéficiaire",
                "Pourcentage du montant de la subvention attribuée au bénéficiaire",
                "Pourcentage subvention",
                "PourcentageSubvention",
            ],
        ],
        adapter: value => (value ? parseFloat(value) : value),
    },
    aidSystem: [[...getMapperVariants("aidSystem")]],
};
