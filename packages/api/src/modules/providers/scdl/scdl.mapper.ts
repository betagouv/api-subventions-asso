import { shortISOPeriodRegExp, shortISORegExp } from "../../../shared/helpers/DateHelper";

export const SCDL_MAPPER = {
    allocatorName: [["nomAttribuant", "Nom attributaire*"]],
    allocatorSiret: [["idAttribuant", "Identification de l'attributaire*"]],
    conventionDate: {
        path: [["dateConvention", "Date de convention*"]],
        adapter: value => (value ? new Date(value) : value),
    },
    decisionReference: [["referenceDecision", "Référence de la décision"]],
    associationName: [["nomBeneficiaire", "Nom du bénéficiaire*"]],
    associationSiret: [["idBeneficiaire", "Identification du bénéficiaire*"]],
    associationRna: [["rnaBeneficiaire"]],
    object: [["object", "Objet de la convention"]],
    amount: {
        path: [["montant", "Montant total de la subvention*"]],
        adapter: value => (value ? parseFloat(value) : value),
    },
    paymentConditions: [["nature", "Conditions de versement*"]],
    paymentStartDate: {
        path: [["datesPeriodeVersement", "Date de versement"]],
        adapter: value => (shortISORegExp.test(value) ? new Date(value.split("/")[0]) : value),
    },
    paymentEndDate: {
        path: [["datesPeriodeVersement", "Date de versement"]],
        adapter: value => {
            if (shortISOPeriodRegExp.test(value)) return new Date(value.split("/")[1]);
            else if (shortISORegExp.test(value)) return new Date(value);
            else return null;
        },
    },
    idRAE: [["idRAE", "Numéro de référencement au répertoire des entreprises"]],
    UeNotification: {
        path: [["notificationUE", "Aide notifiée Ã  l'Europe"]],
        adapter: value => {
            if (value === "oui") return true;
            if (value === "non") return false;
            return undefined;
        },
    },
    grantPercentage: {
        path: ["pourcentageSubvention", "Pourcentage du montant de la subvention attribué au bénéficiaire*"],
        adapter: value => (value ? parseFloat(value) : value),
    },
    aidSystem: ["dispositifAide"],
};
