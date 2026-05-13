import OsirisActionDto, { OsirisActionRawData } from "../osiris-action.dto";

export const OSIRIS_ACTION_RAW_DATA: OsirisActionRawData = {
    "Dossier/action": {
        "Numero Action Osiris": "DD71-24-0094-01",
        "N° Dossier Compte Asso": "LE_COMPTE_ASSO_ID",
        "Exercice budgetaire": 2022,
        "N° EJ": "EJ00001",
    },
    Bénéficiaire: {
        "N° Siret": "10000000000001",
    },
    "Fédération d'affiliation": {
        Fédération: "Fédération Sportive",
        "Nombre licenciés": 150,
        "Nombre licenciés hommes": 80,
        "Nombre licenciées femmes": 70,
    },
    "Moyens matériels et humains": {
        "Bénévoles Nombre": 10,
        "Bénévoles ETPT": 2.5,
        "Salariés Nombre": 5,
        "Salariés ETPT": 4.5,
        "Dont en CDI Nombre": 3,
        "Dont en CDI ETPT": 3,
        "Dont en CDD Nombre": 2,
        "Dont en CDD ETPT": 1.5,
        "Dont emplois aidés Nombre": 1,
        "Dont emplois aidés ETPT": 1,
        "Volontaires Nombre": 2,
        "Volontaires ETPT": 1.8,
    },
    Territoires: {
        Statut: "QPV",
        Commentaire: "Zone prioritaire",
    },
    "Caractéristiques actions": {
        Rang: 1,
        Intitulé: "intitulé de l'action",
        Objectifs: "Objectifs de l'action",
        "Objectifs opérationnels": "Objectifs opérationnels détaillés",
        Description: "description de l'action",
        "Nature de l'aide": "aide en numéraire",
        "Modalité de l'aide": "Subvention",
        "Modalité ou dispositif": "FDVA",
    },
    Evaluation: {
        Indicateurs: "Nombre de bénéficiaires",
    },
    Cofinanceurs: {
        Noms: "Conseil Régional, Département",
        "Montants demandés": 50000,
    },
    "Montants et versements": {
        "Coût (total charges)": 150000,
        Demandé: 170000,
        Proposé: 150000,
        Accordé: 150000,
        "Montant Total Attribué": 150000,
        Réalisé: 120000,
        Compensation: 0,
    },
};

// Same data, expressed in the semantic camelCase DTO consumed by toEntity().
const OSIRIS_ACTION_DTO: OsirisActionDto = {
    dossier: {
        numeroActionOsiris: "DD71-24-0094-01",
        compteAssoId: "LE_COMPTE_ASSO_ID",
        exerciceBudgetaire: 2022,
        ej: "EJ00001",
    },
    beneficiaire: {
        siret: "10000000000001",
    },
    federation: {
        federation: "Fédération Sportive",
        nombreLicencies: 150,
        nombreLicenciesHommes: 80,
        nombreLicenciesFemmes: 70,
    },
    moyens: {
        benevolesNombre: 10,
        benevolesETPT: 2.5,
        salariesNombre: 5,
        salariesETPT: 4.5,
        salariesCDINombre: 3,
        salariesCDIETPT: 3,
        salariesCDDNombre: 2,
        salariesCDDETPT: 1.5,
        emploiesAidesNombre: 1,
        emploiesAidesETPT: 1,
        volontairesNombre: 2,
        volontairesETPT: 1.8,
    },
    territoires: {
        statut: "QPV",
        commentaire: "Zone prioritaire",
    },
    caracteristiques: {
        rang: 1,
        intitule: "intitulé de l'action",
        objectifs: "Objectifs de l'action",
        objectifsOperationnels: "Objectifs opérationnels détaillés",
        description: "description de l'action",
        natureAide: "aide en numéraire",
        modaliteAide: "Subvention",
        modaliteOuDispositif: "FDVA",
    },
    evaluation: {
        indicateurs: "Nombre de bénéficiaires",
    },
    cofinanceurs: {
        noms: "Conseil Régional, Département",
        montantsDemandes: 50000,
    },
    montants: {
        coutTotalCharges: 150000,
        demande: 170000,
        propose: 150000,
        accorde: 150000,
        montantTotalAttribue: 150000,
        realise: 120000,
        compensation: 0,
    },
};

export default OSIRIS_ACTION_DTO;
