import { ObjectId } from "mongodb";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import { OSIRIS_ID } from "./osiris.request.fixtures";

export const ACTION_ENTITY: OsirisActionEntity = {
    dossier: {
        osirisActionId: `${OSIRIS_ID}-1`,
        uniqueId: `${OSIRIS_ID}-1-2023`,
        requestUniqueId: `${OSIRIS_ID}-2023`,
        compteAssoId: "21-008391",
        exerciceBudgetaire: 2023,
        ej: "",
    },
    beneficiaire: {
        siret: DEFAULT_ASSOCIATION.siret,
    },
    federation: {
        nombreLicencies: 0,
        nombreLicenciesHommes: 0,
        nombreLicenciesFemmes: 0,
    },
    moyens: {
        benevolesNombre: 7,
        benevolesETPT: 1,
        salariesNombre: 1,
        salariesETPT: 1,
        salariesCDINombre: 1,
        salariesCDIETPT: 1,
        salariesCDDNombre: 0,
        salariesCDDETPT: 0,
        emploiesAidesNombre: 1,
        emploiesAidesETPT: 1,
        volontairesNombre: 1,
        volontairesETPT: 1,
    },
    territoires: {
        statut: "",
        commentaire: "Région Centre-Val de Loire",
    },
    caracteristiques: {
        rang: 1,
        intitule: "Une table à l'école",
        objectifs: "Renforcer le rôle social et éducatif du sport",
        objectifsOperationnels: "",
        description: "L'un des principaux moyens de découverte et pratique du sport est l'école.",
        natureAide: "",
        modaliteAide: "",
        modaliteOuDispositif: "",
    },
    evaluation: {
        indicateurs: "Nombre de tables achetés et distribués",
    },
    cofinanceurs: {
        noms: "Direction régionale du Centre-Val de Loire;Agence Nationale du Sport;",
        montantsDemandes: 9500,
    },
    montants: {
        coutTotalCharges: 25500,
        demande: 7500,
        propose: 0,
        accorde: 0,
        montantTotalAttribue: 0,
        realise: 0,
        compensation: 0,
    },
    updateDate: new Date("2025-08-05"),
};

export const ACTION_DBO = { ...ACTION_ENTITY, _id: new ObjectId("6891f6d57719a255a02f9140") };
