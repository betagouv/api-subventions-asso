import { DefaultObject, ParserInfo, ParserPath } from "../../../@types";
import { shortISOPeriodRegExp, shortISORegExp } from "../../../shared/helpers/DateHelper";

const OFFICIAL_MAPPER = {
    allocatorName: "nomAttribuant",
    allocatorSiret: "idAttribuant",
    conventionDate: "dateConvention",
    decisionReference: "referenceDecision",
    associationName: "nomBeneficiaire",
    associationSiret: "idBeneficiaire",
    associationRna: "rnaBeneficiaire",
    object: "object",
    amount: "montant",
    paymentConditions: "nature",
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

export const SCDL_MAPPER: DefaultObject<ParserPath | ParserInfo> = {
    allocatorName: [[...getMapperVariants("allocatorName"), "Nom attributaire*"]],
    allocatorSiret: [[...getMapperVariants("allocatorSiret"), "Identification de l'attributaire*"]],
    conventionDate: {
        path: [[...getMapperVariants("conventionDate"), "Date de convention*"]],
        adapter: value => (value ? new Date(value) : value),
    },
    decisionReference: [[...getMapperVariants("decisionReference"), "Référence de la décision"]],
    associationName: [[...getMapperVariants("associationName"), "Nom du bénéficiaire*"]],
    associationSiret: [[...getMapperVariants("associationSiret"), "Identification du bénéficiaire*"]],
    associationRna: [[...getMapperVariants("associationRna")]],
    object: [[...getMapperVariants("object"), "Objet de la convention"]],
    amount: {
        path: [[...getMapperVariants("amount"), "Montant total de la subvention*"]],
        adapter: value => (value ? parseFloat(value) : value),
    },
    paymentConditions: [[...getMapperVariants("paymentConditions"), "Conditions de versement*"]],
    paymentStartDate: {
        path: [[...getMapperVariants("paymentStartDate"), "Date de versement"]],
        // @ts-expect-error: with undefined it returns false so we don't need to check it
        adapter: value => (shortISORegExp.test(value) ? new Date(value.split("/")[0].trim()) : value),
    },
    paymentEndDate: {
        path: [[...getMapperVariants("paymentEndDate"), "Date de versement"]],
        adapter: value => {
            // @ts-expect-error: with undefined it returns false so we don't need to check it
            if (shortISOPeriodRegExp.test(value)) return new Date(value.split("/")[1].trim());
            // @ts-expect-error: with undefined it returns false so we don't need to check it
            else if (shortISORegExp.test(value)) return new Date(value);
            else return null;
        },
    },
    idRAE: [[...getMapperVariants("idRAE"), "Numéro de référencement au répertoire des entreprises"]],
    UeNotification: {
        path: [[...getMapperVariants("UeNotification"), "Aide notifiée Ã  l'Europe"]],
        adapter: value => {
            if (value === "oui") return true;
            if (value === "non") return false;
            return undefined;
        },
    },
    grantPercentage: {
        path: [
            [
                ...getMapperVariants("grantPercentage"),
                "Pourcentage du montant de la subvention attribué au bénéficiaire*",
            ],
        ],
        adapter: value => (value ? parseFloat(value) : value),
    },
    aidSystem: [...getMapperVariants("aidSystem")],
};
