import type OsirisActionsInformations from "../../../../../src/modules/providers/osiris/@types/OsirisActionsInformations";
import OsirisActionEntity from "../../../../../src/modules/providers/osiris/entities/OsirisActionEntity";
import type OsirisRequestEntity from "../../../../../src/modules/providers/osiris/entities/OsirisRequestEntity";
import DEFAULT_ASSOCIATION from "../../../../__fixtures__/association.fixture";

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

export const OSIRIS_ACTION_ENTITY = new OsirisActionEntity(
    {
        osirisActionId: "DD71-24-0094-01",
        requestUniqueId: "DD71-24-0094-2022",
        compteAssoId: "LE_COMPTE_ASSO_ID",

        ej: "EJ00001",
        siret: DEFAULT_ASSOCIATION.siret,
        intitule: "intitulé de l'action",
        description: "description de l'action",
        nature_aide: "aide en numéraire",
        montants_versement_total: 150000,
        montants_versement_demande: 170000,
        montants_versement_propose: 150000,
        montants_versement_accorde: 150000,
        montants_versement_attribue: 150000,
        montants_versement_realise: 120000,
        montants_versement_compensation: 0,
        exercise: 2022,
    } as OsirisActionsInformations,
    {},
    new Date("2025"),
);

export default OSIRIS_REQUEST_ENTITY;
