import OsirisActionEntity from "./OsirisActionEntity";

export type OsirisRequestValue = string | number | boolean | Date | null | undefined;

export interface OsirisRequestDossier {
    osirisId: string;
    compteAssoId?: string;
    ej?: string;
    exerciceBudgetaire: number;
    exerciceDebut?: number;
    exerciceFin?: number;
    dateReception?: number | string | Date;
    dateCommission?: number | string | Date;
    etatDossier?: string;
    service?: string;
    noProgrammeTypeFinancement?: string;
    sousTypeFinancement?: string;
    pluriannualite?: string;
    [key: string]: OsirisRequestValue;
}

export interface OsirisRequestAssociation {
    siret?: string;
    rna?: string;
    nom?: string;
    siege?: boolean | string;
    iban?: string;
    bic?: string;
    [key: string]: OsirisRequestValue;
}

export interface OsirisRequestMontants {
    coutTotalDesCharges?: number;
    coutTotalCharges?: number;
    demande?: number;
    propose?: number;
    accorde?: number;
    [key: string]: OsirisRequestValue;
}

export interface OsirisRequestVersements {
    acompte?: number;
    solde?: number;
    realise?: number;
    compensationN1?: number;
    reversementCompensation?: number;
    [key: string]: OsirisRequestValue;
}

export interface OsirisRequestRepresentantLegal {
    nom?: string;
    prenom?: string;
    civilite?: string;
    fonction?: string;
    courriel?: string;
    adresseMessagerie?: string;
    telephone?: string;
    noTelephone?: string;
    [key: string]: OsirisRequestValue;
}

export interface OsirisRequestCoordonnees {
    voie?: string;
    codePostal?: string;
    commune?: string;
    [key: string]: OsirisRequestValue;
}

export interface OsirisRequestNbActions {
    nombreActions?: number;
    [key: string]: OsirisRequestValue;
}

export default interface OsirisRequestEntity {
    dossier: OsirisRequestDossier;
    association?: OsirisRequestAssociation;
    coordonnees?: OsirisRequestCoordonnees;
    representantLegal?: OsirisRequestRepresentantLegal;
    montants?: OsirisRequestMontants;
    versements?: OsirisRequestVersements;
    nbActions?: OsirisRequestNbActions;
    updateDate: Date;
    actions?: OsirisActionEntity[];
}
