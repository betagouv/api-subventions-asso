import { ApplicationStatus } from "../demandeSubvention";
import { CommonFlatDto, IdentifierIdName, NOT_APPLICABLE } from "./shared";
import { OrDefault } from "../shared";

interface MandatoryApplicationFlatDto extends CommonFlatDto {
    __data__?: Record<string, unknown>;
    /** Identifiant unique de la demande : "{nomProvider}-{idSubventionProvider}" */
    idSubvention: string;
    /**
     * Identifiant interne de la demande chez le fournisseur.
     * En cas de financement pluriannuel, identique pour chaque exercice budgétaire.
     * En cas de bénéficiaires multiples, identique pour chaque bénéficiaire.
     */
    idSubventionProvider: string;
    /** Statut de la demande */
    statutLabel: ApplicationStatus;
    /**
     * Montant demandé en euros pour l'exercice budgétaire.
     * @example 15000
     */
    montantDemande: number | null;
    /**
     * Montant accordé en euros pour l'exercice budgétaire.
     * @example 12000
     */
    montantAccorde: number | null;
    /**
     * Année de l'exercice budgétaire concerné.
     * @example 2024
     */
    exerciceBudgetaire: number | null;
}

type OptionalApplicationFlatDto = {
    /** Identifiant permettant de faire une jointure avec une autre source de données */
    idJointure: string;
    /** Description de l'idJointure et de la jointure qu'il permet d'effectuer */
    descriptionIdJointure: string;
    /** Nom de l'autorité administrative qui pilote le dispositif ou programme de subvention */
    nomAttribuant: string;
    /** Type d'identifiant de l'attribuant (siren, siret, rid, ridet, tahiti...) */
    typeIdAttribuant: IdentifierIdName;
    /** Identifiant de l'autorité administrative qui pilote le dispositif ou programme de subvention */
    idAttribuant: string;
    /** Si l'attribuant délègue la gestion, nom de l'autorité administrative qui gère le dispositif */
    nomAutoriteGestion: string;
    /** Si l'attribuant délègue la gestion, identifiant de l'autorité administrative qui gère le dispositif */
    idAutoriteGestion: string;
    /** Type d'identifiant de l'autorité de gestion */
    typeIdAutoriteGestion: IdentifierIdName;
    /** Nom du service qui instruit la demande */
    nomServiceInstructeur: string;
    /** Type d'identifiant du service instructeur */
    typeIdServiceInstructeur: IdentifierIdName;
    /** Identifiant du service qui instruit la demande */
    idServiceInstructeur: string;
    /** Indique si la subvention est pluriannuelle */
    pluriannualite: boolean;
    /** Années concernées par la pluriannualité */
    anneesPluriannualite: number[];
    /** Date de la commission statuant sur l'attribution ou le refus de la subvention */
    dateDecision: string;
    /** Date de signature de la convention */
    dateConvention: string;
    /** Identifiant interne de l'acte matérialisant la décision d'attribution */
    referenceDecision: string;
    /** Date de dépôt de la demande */
    dateDepotDemande: string;
    /** Année de la demande */
    anneeDemande: number;
    /** Nom du dispositif de financement ou du programme de subvention (FIPDR, MILDECA, FSE...) */
    dispositif: string;
    /** Sous-dispositif de financement */
    sousDispositif: string;
    /** Objet de la demande */
    objet: string;
    /** Nature de l'aide (numéraire ou en nature) */
    nature: ApplicationNature;
    /**
     * Montant total accordé pour l'exercice budgétaire, avant répartition entre bénéficiaires.
     * @example 30000
     */
    montantTotal: number;
    /** Engagement juridique associé */
    ej: string;
    /** Identifiant permettant de relier la demande aux versements */
    idVersement: string;
    /** Modalités de versement */
    conditionsVersements: PaymentCondition;
    /** Description des modalités de versement */
    descriptionConditionsVersements: string;
    /** Périodes de versement */
    datesPeriodeVersement: string[];
    /** Indique si d'autres subventions publiques ont été sollicitées pour le même projet */
    cofinancementsSollicites: boolean;
    /** Noms des attribuants cofinanceurs sollicités */
    nomsAttribuantsCofinanceurs: string[];
    /** Types d'identifiants des cofinanceurs sollicités */
    typeIdCofinanceursSollicites: IdentifierIdName[];
    /** Identifiants des attribuants cofinanceurs sollicités */
    idCofinanceursSollicites: string[];
    /** Numéro unique de référencement au répertoire des aides aux entreprises (RAE) */
    idRAE: string;
    /** Subvention attribuée au titre d'une aide de minimis notifiée à la Commission Européenne */
    notificationUE: boolean;
    /**
     * Pourcentage du montant de la subvention attribuée au bénéficiaire.
     * @example 80
     */
    pourcentageSubvention: number;
    /** Date de mise à jour */
    dateMiseAJour: string;
};

export type ApplicationFlatDto = MandatoryApplicationFlatDto &
    OrDefault<OptionalApplicationFlatDto, NOT_APPLICABLE | null>;

/** Nature de l'aide accordée */
export enum ApplicationNature {
    MONEY = "Aide en numéraire",
    NATURE = "Aide en nature",
}

/** Modalités de versement de la subvention */
export enum PaymentCondition {
    UNIQUE = "UNIQUE",
    PHASED = "PHASED",
    OTHER = "OTHER",
}
