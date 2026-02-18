import type { FlatDbo } from "../@types/FlatDbo";
import { ApplicationNature, ApplicationStatus, OrDefault, PaymentCondition, NOT_APPLICABLE } from "dto";
import { IdentifierIdName } from "../../../identifierObjects/@types/IdentifierName";

interface MandatoryApplicationFlatDbo extends FlatDbo {
    exerciceBudgetaire: number | null; // subventia ne donne pas d'exercice budgétaire donc on est bloqué pour le moment. Pourra être ajouté à FlatDbo une fois que subventia aura donné les exercices
    idSubvention: string; // nomProvider-idSubventionProvider
    idSubventionProvider: string; // id interne (du provider) d'identification d'une subvention permettant de faire le lien avec les actions. En cas de financement pluriannuel, cet identifiant est le même pour chaque exercice budgétaire. Dans le cas où la subvention concerne plusieurs bénéficiaires, cet identifiant est le même pour chaque bénéficiaire
    statutLabel: ApplicationStatus;
    montantDemande: number | null; // Montant demandé par le demandeur pour un exercice budgetaire donné
    montantAccorde: number | null; // Montant accordé au demandeur pour un exercice budgetaire donné
}

type OptionalApplicationFlatDbo = {
    idJointure: string; // id permettant de faire une jointure avec une autre source de données
    descriptionIdJointure: string; // description de l'idJointure et de la jointure que l'idJointure permet d'effectuer
    nomAttribuant: string; // Nom de l'autorité administrative qui pilote le dispositif ou programme de subvention ou en delegue la gestion
    typeIdAttribuant: IdentifierIdName; // type identifiant de l'idAttribuant entre siren, siret, rid, ridet, tahiti, tahiti-t
    idAttribuant: string; // identifiant de l'autorité administrative qui pilote le dispositif ou programme de subvention ou en delegue la gestion
    nomAutoriteGestion: string; // Si l'attribuant delegue la gestion, nom de l'autorité administrative qui gère le dispositif ou programme de subvention.
    idAutoriteGestion: string; // Si l'attribuant delegue la gestion, identifiant de l'autorité administrative qui gère le dispositif ou programme de subvention.
    typeIdAutoriteGestion: IdentifierIdName;
    nomServiceInstructeur: string; // Nom du service qui instruit la demande
    typeIdServiceInstructeur: IdentifierIdName;
    idServiceInstructeur: string; // identifiant du service qui instruit la demande.
    pluriannualite: boolean;
    anneesPluriannualite: number[];
    dateDecision: Date; // Date de la commission statuant sur l'attribution ou le refus de la subvention.
    dateConvention: Date; // Date de signature de la convention.
    referenceDecision: string; // Identifiant interne de l’acte matérialisant la décision d’attribution de la subvention.
    dateDepotDemande: Date;
    anneeDemande: number;
    dispositif: string; // Nom du dispositif de financement ou du programme de subvention (FIPDR, MILDECA, Fonds social européen...).
    sousDispositif: string;
    objet: string;
    nature: ApplicationNature;
    montantTotal: number; // Montant total de la subvention accordé pour un exercice budgetaire donné, avant répartition entre les béneficiaires.
    ej: string;
    idVersement: string; // Identifiant permettant de relier la demande de subvention aux versements.
    conditionsVersements: PaymentCondition;
    descriptionConditionsVersements: string;
    datesPeriodeVersement: Date[];
    cofinancementsSollicites: boolean; // Indiquer si d'autres subventions publiques ont été sollicités pour le même projet.
    nomsAttribuantsCofinanceurs: string[]; // Liste des noms des attribuants cofinanceurs qui ont été sollicités pour le projet.
    typeIdCofinanceursSollicites: IdentifierIdName[];
    idCofinanceursSollicites: string[]; // Liste des identifiants des attribuants cofinanceurs qui ont été sollicités pour le projet
    idRAE: string; // Numéro unique de référencement au répertoire des aides aux entreprises (RAE)
    notificationUE: boolean; // Subvention attribuée au titre d’une aide de minimis notifiée à la Commission Européenne en vertu des dispositions du règlement n° 1407/2013 du 18 décembre 2013.
    pourcentageSubvention: number; // Pourcentage du montant de la subvention attribuée au bénéficiaire
    dateMiseAJour: Date;
};

export type ApplicationFlatDbo = MandatoryApplicationFlatDbo &
    OrDefault<OptionalApplicationFlatDbo, NOT_APPLICABLE | null>;
