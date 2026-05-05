export type OsirisRequestRawValue = string | number | boolean | Date | null | undefined;
export type OsirisRequestRawCategory = Record<string, OsirisRequestRawValue>;
export type OsirisRequestRawData = Record<string, OsirisRequestRawCategory>;

export interface OsirisRequestDossierDto {
    osirisId?: string;
    compteAssoId?: string;
    ej?: string;
    dateReception?: number | string | Date;
    dateCommission?: number | string | Date;
    exerciceDebut?: number;
    exerciceFin?: number;
    etatDossier?: string;
    service?: string;
    noProgrammeTypeFinancement?: string;
    sousTypeFinancement?: string;
    pluriannualite?: string;
}

export interface OsirisRequestAssociationDto {
    rna?: string;
    siret?: string;
    nom?: string;
    siege?: string | boolean;
    iban?: string;
    bic?: string;
}

export interface OsirisRequestCoordonneesDto {
    voie?: string;
    codePostal?: string;
    commune?: string;
}

export interface OsirisRequestRepresentantLegalDto {
    nom?: string;
    prenom?: string;
    civilite?: string;
    fonction?: string;
    courriel?: string;
    adresseMessagerie?: string;
    telephone?: string;
    noTelephone?: string;
}

export interface OsirisRequestMontantsDto {
    coutTotalDesCharges?: number;
    coutTotalCharges?: number;
    demande?: number;
    propose?: number;
    accorde?: number;
}

export interface OsirisRequestVersementsDto {
    acompte?: number;
    solde?: number;
    realise?: number;
    compensationN1?: number;
    reversementCompensation?: number;
}

export interface OsirisRequestNbActionsDto {
    nombreActions?: number;
}

export default interface OsirisRequestDto {
    dossier?: OsirisRequestDossierDto;
    association?: OsirisRequestAssociationDto;
    coordonnees?: OsirisRequestCoordonneesDto;
    representantLegal?: OsirisRequestRepresentantLegalDto;
    montants?: OsirisRequestMontantsDto;
    versements?: OsirisRequestVersementsDto;
    nbActions?: OsirisRequestNbActionsDto;
}
