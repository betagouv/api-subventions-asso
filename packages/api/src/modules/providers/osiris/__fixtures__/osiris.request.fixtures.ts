import { ObjectId } from "mongodb";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";

export const OSIRIS_ID = "DR-CENT-21-0002";

export const REQUEST_ENTITY: OsirisRequestEntity = {
    dossier: {
        osirisId: OSIRIS_ID,
        compteAssoId: "21-008391",
        ej: "123456789",
        dateCommission: new Date("2023-01-25"),
        exerciceBudgetaire: 2023,
        exerciceDebut: 2021,
        exerciceFin: 2024,
        service: "DR-CENT",
        noProgrammeTypeFinancement: "FDVA",
        sousTypeFinancement: "Financement global-nouveau(x) projet(s) innovant(s)",
        etatDossier: "Refusé",
        pluriannualite: "Annuel",
        dateReception: 43549.44370065972,
    },
    association: {
        siret: DEFAULT_ASSOCIATION.siret,
        rna: DEFAULT_ASSOCIATION.rna,
        nom: DEFAULT_ASSOCIATION.name,
        siege: true,
        iban: "FR7600000000000000000000000",
        bic: "BANK11111111",
    },
    coordonnees: {
        voie: "40 RUE DU GéNéRAL LECLERC",
        codePostal: "41300",
        commune: "SALBRIS",
    },
    representantLegal: {
        nom: "Doe",
        prenom: "John",
        fonction: "Président",
        civilite: "Monsieur",
        courriel: "johndoe@hotmail.fr",
        telephone: "0601020304",
    },
    montants: {
        coutTotalDesCharges: 25500,
        demande: 7500,
        propose: 7200,
        accorde: 7200,
    },
    versements: {
        acompte: 0,
        solde: 0,
        realise: 0,
        compensationN1: 0,
        reversementCompensation: 0,
    },
    updateDate: new Date("2025-08-05"),
    actions: [],
};

export const REQUEST_DBO = { ...REQUEST_ENTITY, _id: new ObjectId("685be74b0d6ac15b4e3ef6e7") };
