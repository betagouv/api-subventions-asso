import { ApplicationStatus } from "dto";

export type StructureIdType = "siret" | "siren" | "rid" | "ridet" | "tahiti" | "tahiti-t";

export enum ApplicationNature {
    MONEY = "MONEY",
    NATURE = "NATURE",
}

export enum PaymentCondition {
    UNIQUE = "UNIQUE",
    PHASED = "PHASED",
    OTHER = "OTHER",
}

// TODO where to accept null ?

// careful, autoriteGestion != serviceInstructeur != attribuant
// for all typeId properties,
export type ApplicationFlatEntity = {
    idUnique: string; // idSubvention-exerciceBudgetaire TODO rename
    idSubvention: string; // nomProvider-idSubventionProvider

    idSubventionProvider: string;
    idJointure?: string;
    descriptionIdJointure?: string; // description de l'idJointure et de la jointure que l'idJointure permets d'effectuer
    provider: string;
    nomAttribuant?: string; // Nom de l'autorité administrative qui pilote le dispositif ou programme de subvention ou en delegue la gestion
    typeIdAttribuant?: StructureIdType;
    idAttribuant?: string;
    nomAutoriteGestion?: string; // Si l'attribuant delegue la gestion, nom de l'autorité administrative qui gère le dispositif ou programme de subvention
    idAutoriteGestion?: string;
    typeIdAutoriteGestion?: StructureIdType;
    nomServiceInstructeur?: string; // Nom du service qui instruit la demande
    typeIdServiceInstructeur?: StructureIdType;
    idServiceInstructeur?: string;
    idBeneficiaire: string;
    typeIdBeneficiaire?: string; // this id must be establishment level so no siren
    exerciceBudgetaire: number;
    pluriannualite?: boolean;
    anneesPluriannualite?: number[];
    dateDecision?: Date;
    dateConvention: Date; // TODO only mandatory because we need it for ProviderValue's date
    referenceDecision?: string;
    dateDepotDemande?: Date;
    anneeDemande?: number;
    dispositif?: string;
    sousDispositif?: string;
    statutLabel: ApplicationStatus;
    objet?: string;
    nature?: ApplicationNature;
    montantDemande: number;
    montantAccorde?: number;
    montantTotal?: number;
    ej?: string;
    idVersement?: string;
    conditionsVersements?: PaymentCondition;
    descriptionConditionsVersements?: string;
    datesPeriodeVersement?: Date | Date[];
    cofinancementsSollicites?: boolean;
    nomsAttribuantsCofinanceurs?: string[];
    typeIdCofinanceursSollicites?: StructureIdType[];
    idCofinanceursSollicites?: string[];
    idRAE?: string;
    notificationUE?: boolean;
    pourcentageSubvention?: number;
};
