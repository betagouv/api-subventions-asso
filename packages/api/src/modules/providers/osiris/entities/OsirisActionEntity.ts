import { ObjectId } from "mongodb";
import { ParserInfo } from "../../../../@types/ParserInfo";
import ParserPath from "../../../../@types/ParserPath";
import IOsirisActionsInformations from "../@types/IOsirisActionsInformations";

export default class OsirisActionEntity {
    public static defaultMainCategory = "Dossier/action";

    public static indexedInformationsPath: {[key: string]: ParserPath | ParserInfo }= {
        osirisActionId: ["Dossier/action", "Numero Action Osiris"],
        compteAssoId: ["Dossier/action", "N° Dossier Compte Asso"],
        federation: ["Fédération d'affiliation", "Fédération"],
        licencies: ["Fédération d'affiliation", "Nombre licenciés"],
        licenciesHommes: ["Fédération d'affiliation", "Nombre licenciés hommes"],
        licenciesFemmes: ["Fédération d'affiliation", "Nombre licenciées femmes"],
        benevoles: ["Moyens matériels et humains", "Bénévoles Nombre"],
        benevolesETPT: ["Moyens matériels et humains", "Bénévoles ETPT"],
        salaries: ["Moyens matériels et humains", "Salariés Nombre"],
        salariesETPT: ["Moyens matériels et humains", "Salariés ETPT"],
        salariesCDI: ["Moyens matériels et humains", "Dont en CDI Nombre"],
        salariesCDIETPT: ["Moyens matériels et humains", "Dont en CDI ETPT"],
        salariesCDD: ["Moyens matériels et humains", "Dont en CDD Nombre"],
        salariesCDDETPT: ["Moyens matériels et humains", "Dont en CDD ETPT"],
        emploiesAides: ["Moyens matériels et humains", "Dont emplois aidés Nombre"],
        emploiesAidesETPT: ["Moyens matériels et humains", "Dont emplois aidés ETPT"],
        volontaires: ["Moyens matériels et humains", "Volontaires Nombre"],
        volontairesETPT: ["Moyens matériels et humains", "Volontaires ETPT"],
        territoireStatus: ["Territoires", "Statut"],
        territoireCommentaire: ["Territoires", "Commentaire"],

        ej: ["Dossier/action", "N° EJ"],
        rang: ["Caractéristiques actions", "Rang"],
        intitule: ["Caractéristiques actions", "Intitulé"],
        objectifs: ["Caractéristiques actions", "Objectifs"],
        objectifs_operationnels: ["Caractéristiques actions", "Objectifs opérationnels"],
        description: ["Caractéristiques actions", "Description"],
        nature_aide: ["Caractéristiques actions", "Nature de l'aide"],
        modalite_aide: ["Caractéristiques actions", "Modalité de l'aide"],
        modalite_ou_dispositif: ["Caractéristiques actions", "Modalité ou dispositif"],
        indicateurs: ["Evaluation", "Indicateurs"],
        
        cofinanceurs: ["Cofinanceurs", "Noms"],
        cofinanceurs_montant_demandes: ["Cofinanceurs", "Montants demandés"],

        montants_versement_total: ["Montants et versements", "Coût (total charges)"],
        montants_versement_demande: ["Montants et versements", "Demandé"],
        montants_versement_propose: ["Montants et versements", "Proposé"],
        montants_versement_accorde: ["Montants et versements", "Accordé"],
        montants_versement_attribue: ["Montants et versements", "Montant Total Attribué"],
        montants_versement_realise: ["Montants et versements", "Réalisé"],
        montants_versement_compensation: ["Montants et versements", "Compensation"],
    }

    constructor(
        public indexedInformations: IOsirisActionsInformations,
        public data: unknown,
        public _id?: ObjectId
    ) {}
}