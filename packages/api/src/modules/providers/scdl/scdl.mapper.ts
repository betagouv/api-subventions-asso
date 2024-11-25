import { shortISORegExp } from "../../../shared/helpers/DateHelper";
import { GenericParser } from "../../../shared/GenericParser";
import { BeforeAdaptation } from "../../../@types";
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

const CONVENTION_DATE_PATHS = [
    ...getMapperVariants("conventionDate"),
    "datedeconvention",
    "Date de convention*",
    "Date de la convention",
    "Date de la convention de subvention (AAAA-MM-JJ)",
    "datedeConvention",
];

const dateAdapter = (date: BeforeAdaptation | undefined | null): Date | undefined => {
    if (!date) return undefined;
    if (typeof date === "string") return new Date(date);
    return GenericParser.ExcelDateToJSDate(Number(date));
};

export const SCDL_MAPPER: ScdlGrantSchema = {
    allocatorName: { path: [["nomAttribuant", "Nom de l'attribuant"]] },
    allocatorSiret: {
        path: [["idAttribuant", "Identification de l'attribuant (SIRET)"]],
        adapter: v => v?.toString(),
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
    decisionReference: [[...getMapperVariants("decisionReference"), "Référence de la décision"]],
    associationName: [
        [
            ...getMapperVariants("associationName"),
            "Nom du bénéficiaire*",
            "Nom Bénéficiaire",
            "NOM Bénéficiaire",
            "Nom du bénéficiaire",
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
            ],
        ],
        adapter: v => v?.toString(),
    },
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
        adapter: value => (value && typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/, "")) : value),
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
                "Date(s) ou période(s) de versement (AAAA-MM-JJ)",
            ],
        ],
        // @ts-expect-error: with undefined it returns false, so we don't need to check it
        adapter: value => (shortISORegExp.test(value) ? new Date(value.split(/[/_]/)[0].trim()) : dateAdapter(value)),
    },
    paymentEndDate: {
        path: [
            [
                ...getMapperVariants("paymentEndDate"),
                "Date de versement",
                "dateperiodedversement",
                "Date(s) ou période(s) de versement (AAAA-MM-JJ)",
            ],
        ],
        adapter: value => {
            if (typeof value !== "string") return undefined;
            const noSpaceValue = value?.replaceAll(" ", "");
            if (expandedShortISOPeriodRegExp.test(noSpaceValue)) return new Date(noSpaceValue.split(/[/_]/)[1].trim());
            else if (shortISORegExp.test(noSpaceValue)) return new Date(noSpaceValue);
            else return null;
        },
    },
    idRAE: [
        [
            ...getMapperVariants("idRAE"),
            "Numéro de référencement au répertoire des entreprises",
            "Numéro de référencement au répertoire des entreprises",
            "Numéro unique de référencement au répertoire des aides aux entreprises (RAE)",
        ],
    ],
    UeNotification: {
        path: [
            [
                ...getMapperVariants("UeNotification"),
                "Aide notifiée Ã  l'Europe",
                "Aides ne relevant pas d'une aide d'état",
                "Aide d'Etat notifiée à la Commission européenne, conformément aux dispositions du règlement (UE) n° 1407/2013 de la Commission du 18 décembre 2013",
            ],
        ],
        adapter: value => {
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
            ],
        ],
        adapter: value => (value ? parseFloat(value) : value),
    },
    aidSystem: [[...getMapperVariants("aidSystem")]],
};
