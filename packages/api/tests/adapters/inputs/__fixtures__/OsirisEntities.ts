import type OsirisActionEntity from "../../../../src/modules/providers/osiris/entities/OsirisActionEntity";
import type OsirisRequestEntity from "../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import DEFAULT_ASSOCIATION from "../../../__fixtures__/association.fixture";

export const OSIRIS_REQUEST_ENTITY: OsirisRequestEntity = {
    dossier: {
        osirisId: "DD71-24-0094",
        compteAssoId: "LE_COMPTE_ASSO_ID",
        ej: "EJ00001",
        dateCommission: new Date("2022-01-01"),
        exerciceBudgetaire: 2022,
        exerciceDebut: 2022,
        exerciceFin: 2025,
        dateReception: 43549.44370065972,
    },
    association: {
        siret: DEFAULT_ASSOCIATION.siret,
        rna: DEFAULT_ASSOCIATION.rna,
        nom: DEFAULT_ASSOCIATION.name,
    },
    montants: {
        // accorde: 0,
    },
    coordonnees: {
        voie: "rue Waldeck-Rousseau",
        codePostal: "75000",
    },
    updateDate: new Date("2025"),
    actions: [],
};

export const OSIRIS_ACTION_ENTITY: OsirisActionEntity = {
    dossier: {
        osirisActionId: "DD71-24-0094-01",
        uniqueId: "DD71-24-0094-01-2022",
        requestUniqueId: "DD71-24-0094-2022",
        compteAssoId: "LE_COMPTE_ASSO_ID",
        exerciceBudgetaire: 2022,
        ej: "EJ00001",
    },
    beneficiaire: {
        siret: DEFAULT_ASSOCIATION.siret,
    },
    caracteristiques: {
        intitule: "intitulé de l'action",
        description: "description de l'action",
        natureAide: "aide en numéraire",
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
    updateDate: new Date("2025"),
};

export default OSIRIS_REQUEST_ENTITY;
