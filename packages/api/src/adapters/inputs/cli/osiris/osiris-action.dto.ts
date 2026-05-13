export type OsirisActionRawValue = string | number | boolean | Date | null | undefined;
export type OsirisActionRawCategory = Record<string, OsirisActionRawValue>;
export type OsirisActionRawData = Record<string, OsirisActionRawCategory>;

export interface OsirisActionDossierDto {
    numeroActionOsiris?: string;
    compteAssoId?: string;
    exerciceBudgetaire?: number;
    ej?: string;
}

export interface OsirisActionBeneficiaireDto {
    siret?: string;
}

export interface OsirisActionFederationDto {
    federation?: string;
    nombreLicencies?: number;
    nombreLicenciesHommes?: number;
    nombreLicenciesFemmes?: number;
}

export interface OsirisActionMoyensDto {
    benevolesNombre?: number;
    benevolesETPT?: number;
    salariesNombre?: number;
    salariesETPT?: number;
    salariesCDINombre?: number;
    salariesCDIETPT?: number;
    salariesCDDNombre?: number;
    salariesCDDETPT?: number;
    emploiesAidesNombre?: number;
    emploiesAidesETPT?: number;
    volontairesNombre?: number;
    volontairesETPT?: number;
}

export interface OsirisActionTerritoiresDto {
    statut?: string;
    commentaire?: string;
}

export interface OsirisActionCaracteristiquesDto {
    rang?: number;
    intitule?: string;
    objectifs?: string;
    objectifsOperationnels?: string;
    description?: string;
    natureAide?: string;
    modaliteAide?: string;
    modaliteOuDispositif?: string;
}

export interface OsirisActionEvaluationDto {
    indicateurs?: string;
}

export interface OsirisActionCofinanceursDto {
    noms?: string;
    montantsDemandes?: number;
}

export interface OsirisActionMontantsDto {
    coutTotalCharges?: number;
    demande?: number;
    propose?: number;
    accorde?: number;
    montantTotalAttribue?: number;
    realise?: number;
    compensation?: number;
}

export default interface OsirisActionDto {
    dossier?: OsirisActionDossierDto;
    beneficiaire?: OsirisActionBeneficiaireDto;
    federation?: OsirisActionFederationDto;
    moyens?: OsirisActionMoyensDto;
    territoires?: OsirisActionTerritoiresDto;
    caracteristiques?: OsirisActionCaracteristiquesDto;
    evaluation?: OsirisActionEvaluationDto;
    cofinanceurs?: OsirisActionCofinanceursDto;
    montants?: OsirisActionMontantsDto;
}
