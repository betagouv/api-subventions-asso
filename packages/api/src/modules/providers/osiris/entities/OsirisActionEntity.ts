export const OsirisActionDefaultMainCategory = "Dossier/action";

export interface OsirisActionDossier {
    osirisActionId: string;
    uniqueId: string;
    requestUniqueId: string;
    compteAssoId: string;
    exerciceBudgetaire: number;
    ej?: string;
}

export interface OsirisActionBeneficiaire {
    siret?: string;
}

export interface OsirisActionFederation {
    federation?: string;
    nombreLicencies?: number;
    nombreLicenciesHommes?: number;
    nombreLicenciesFemmes?: number;
}

export interface OsirisActionMoyens {
    benevolesNombre: number;
    benevolesETPT: number;
    salariesNombre: number;
    salariesETPT: number;
    salariesCDINombre: number;
    salariesCDIETPT: number;
    salariesCDDNombre: number;
    salariesCDDETPT: number;
    emploiesAidesNombre: number;
    emploiesAidesETPT: number;
    volontairesNombre: number;
    volontairesETPT: number;
}

export interface OsirisActionTerritoires {
    statut?: string;
    commentaire?: string;
}

export interface OsirisActionCaracteristiques {
    rang?: number;
    intitule?: string;
    objectifs?: string;
    objectifsOperationnels?: string;
    description?: string;
    natureAide?: string;
    modaliteAide?: string;
    modaliteOuDispositif?: string;
}

export interface OsirisActionEvaluation {
    indicateurs?: string;
}

export interface OsirisActionCofinanceurs {
    noms?: string;
    montantsDemandes?: number;
}

export interface OsirisActionMontants {
    coutTotalCharges?: number;
    demande?: number;
    propose?: number;
    accorde?: number;
    montantTotalAttribue?: number;
    realise?: number;
    compensation?: number;
}

export default interface OsirisActionEntity {
    dossier: OsirisActionDossier;
    beneficiaire?: OsirisActionBeneficiaire;
    federation?: OsirisActionFederation;
    moyens?: OsirisActionMoyens;
    territoires?: OsirisActionTerritoires;
    caracteristiques?: OsirisActionCaracteristiques;
    evaluation?: OsirisActionEvaluation;
    cofinanceurs?: OsirisActionCofinanceurs;
    montants?: OsirisActionMontants;
    updateDate: Date;
}
