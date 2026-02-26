import DEFAULT_ASSOCIATION from "../../../../../../tests/__fixtures__/association.fixture";
import { SimplifiedJoinedDauphinGispro } from "../SimplifiedDauphinGispro";

const EXERCISE = 2022;

const SIMPLIFIED_JOINED_DAUPHIN_GISPRO: SimplifiedJoinedDauphinGispro = {
    _id: {
        siretDemandeur: DEFAULT_ASSOCIATION.siret,
        exerciceBudgetaire: EXERCISE,
        codeDossierOrAction: "CODE_GISPRO",
    },

    siretDemandeur: DEFAULT_ASSOCIATION.siret,
    exerciceBudgetaire: EXERCISE,

    montantDemande: 890,
    montantAccorde: 800,

    referenceAdministrative: [],
    intituleProjet: ["intitule 1"],
    thematique: ["thematique 1"],
    financeurs: ["financeur 1"],
    description: ["desc"],
    instructorService: ["instructor 1"],

    periode: ["PLURIANNUELLE"],
    virtualStatusLabel: [],
    ej: ["ej"],

    dateDemande: [new Date("2021-11-12")],
    codeDossier: "code dossier",
};

export default SIMPLIFIED_JOINED_DAUPHIN_GISPRO;
