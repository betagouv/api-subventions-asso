import { ObjectId } from "mongodb";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import OsirisActionsInformations from "../@types/OsirisActionsInformations";
import { OSIRIS_ID } from "./osiris.request.fixtures";

export const ACTION_ENTITY = new OsirisActionEntity(
    {
        exercise: 2023,
        intitule: "Une table à l'école",
        osirisActionId: `${OSIRIS_ID}-1`,
        compteAssoId: "21-008391",
        licencies: 0,
        licenciesHommes: 0,
        licenciesFemmes: 0,
        benevoles: 7,
        benevolesETPT: 1,
        salaries: 1,
        salariesETPT: 1,
        salariesCDI: 1,
        salariesCDIETPT: 1,
        salariesCDD: 0,
        salariesCDDETPT: 0,
        emploiesAides: 1,
        emploiesAidesETPT: 1,
        volontaires: 1,
        volontairesETPT: 1,
        territoireCommentaire: "Région Centre-Val de Loire",
        siret: DEFAULT_ASSOCIATION.siret,
        rang: 1,
        objectifs: "Renforcer le rôle social et éducatif du sport",
        description: "L'un des principaux moyens de découverte et pratique du sport est l'école.",
        indicateurs: "Nombre de tables achetés et distribués",
        cofinanceurs: "Direction régionale du Centre-Val de Loire;Agence Nationale du Sport;",
        cofinanceurs_montant_demandes: 9500,
        montants_versement_total: 25500,
        montants_versement_demande: 7500,
        montants_versement_propose: 0,
        montants_versement_accorde: 0,
        montants_versement_realise: 0,
        montants_versement_compensation: 0,
        ej: "",
        territoireStatus: "",
        objectifs_operationnels: "",
        nature_aide: "",
        modalite_aide: "",
        modalite_ou_dispositif: "",
        montants_versement_attribue: 0,
    } as OsirisActionsInformations,
    {},
    new Date("2025-08-05"),
);

export const ACTION_DBO = { ...ACTION_ENTITY, _id: new ObjectId("6891f6d57719a255a02f9140") };
