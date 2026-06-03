import OsirisActionEntity from "./OsirisActionEntity";

export const OsirisRequestDefaultMainCategory = "Dossier";

export interface OsirisRequestDossier {
    osirisId: string;
    compteAssoId?: string;
    ej?: string;
    exerciceBudgetaire: number;
    exerciceDebut?: number | Date;
    exerciceFin?: number;
    dateReception?: number | string | Date;
    dateCommission?: number | string | Date;
    etatDossier?: string;
    service?: string;
    noProgrammeTypeFinancement?: string;
    sousTypeFinancement?: string;
    pluriannualite?: string;
}

export interface OsirisRequestAssociation {
    siret: string;
    rna?: string;
    nom?: string;
    siege?: boolean | string;
    iban?: string;
    bic?: string;
}

export interface OsirisRequestMontants {
    coutTotalDesCharges?: number;
    demande?: number;
    propose?: number;
    accorde?: number;
}

export interface OsirisRequestVersements {
    acompte?: number;
    solde?: number;
    realise?: number;
    compensationN1?: number;
    reversementCompensation?: number;
}

export interface OsirisRequestRepresentantLegal {
    nom?: string;
    prenom?: string;
    civilite?: string;
    fonction?: string;
    courriel?: string;
    telephone?: string;
}

export interface OsirisRequestCoordonnees {
    voie?: string;
    codePostal?: string;
    commune?: string;
}

export interface OsirisRequestNbActions {
    nombreActions?: number;
}

export default interface OsirisRequestEntity {
    dossier: OsirisRequestDossier;
    association: OsirisRequestAssociation;
    coordonnees?: OsirisRequestCoordonnees;
    representantLegal?: OsirisRequestRepresentantLegal;
    montants?: OsirisRequestMontants;
    versements?: OsirisRequestVersements;
    nbActions?: OsirisRequestNbActions;
    updateDate: Date;
    actions?: OsirisActionEntity[];
}
