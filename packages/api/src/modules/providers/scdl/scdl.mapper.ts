import { getShortISODate, shortISORegExp } from "../../../shared/helpers/DateHelper";

export const SCDL_MAPPER = {
    allocatorName: ["Nom attributaire*"],
    allocatorSiret: ["Identification de l'attributaire*"],
    conventionDate: {
        path: ["Date de convention*"],
        adapter: value => (value ? new Date(value) : value),
    },
    decisionReference: ["Référence de la décision"],
    associationName: ["Nom du bénéficiaire*"],
    associationSiret: ["Identification du bénéficiaire*"],
    object: ["Objet de la convention"],
    amount: {
        path: ["Montant total de la subvention*"],
        adapter: value => (value ? parseFloat(value) : value),
    },
    paymentConditions: ["Conditions de versement*"],
    paymentStartDate: {
        path: ["Date de versement"],
        adapter: value => (shortISORegExp.test(value) ? new Date(value.split("/")[0]) : value),
    },
    paymentEndDate: {
        path: ["Date de versement"],
        adapter: value => (value ? new Date(value.split("/")[1]) : value),
    },
    idRAE: ["Numéro de référencement au répertoire des entreprises"],
    UeNotification: {
        path: ["Aide notifiée Ã  l'Europe"],
        adapter: value => {
            if (value === "oui") return true;
            if (value === "non") return false;
            return undefined;
        },
    },
    grantPercentage: {
        path: ["Pourcentage du montant de la subvention attribué au bénéficiaire*"],
        adapter: value => (value ? parseFloat(value) : value),
    },
};
