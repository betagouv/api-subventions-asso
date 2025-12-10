import { SiretDto } from "dto";

export default interface OsirisActionsInformations {
    osirisActionId: string;
    uniqueId: string;
    requestUniqueId: string;
    compteAssoId: string;

    licencies: number;
    licenciesHommes: number;
    licenciesFemmes: number;
    benevoles: number;
    benevolesETPT: number;
    salaries: number;
    salariesETPT: number;
    salariesCDI: number;
    salariesCDIETPT: number;
    salariesCDD: number;
    salariesCDDETPT: number;
    emploiesAides: number;
    emploiesAidesETPT: number;
    volontaires: number;
    volontairesETPT: number;
    federation?: string;

    territoireStatus: string;
    territoireCommentaire: string;

    ej: string;
    siret: SiretDto;
    rang: number;
    intitule: string;
    objectifs: string;
    objectifs_operationnels: string;
    description: string;
    nature_aide: string;
    modalite_aide: string;
    modalite_ou_dispositif: string;
    indicateurs: string;

    cofinanceurs?: string;
    cofinanceurs_montant_demandes: number;

    montants_versement_total: number;
    montants_versement_demande: number;
    montants_versement_propose: number;
    montants_versement_accorde: number;
    montants_versement_attribue: number;
    montants_versement_realise: number;
    montants_versement_compensation: number;

    exercise: number;
}
