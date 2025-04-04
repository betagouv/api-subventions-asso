import { ApplicationStatus } from "dto";
import Siret from "../valueObjects/Siret";
import Siren from "../valueObjects/Siren";

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

// entities and draft are almost equal but we want ids to be built in constructor
// and we want to be able to build with a properly types object

// TODO where to accept null ?

export default class ApplicationFlatEntity {
    public idUnique: string; // idSubvention-exerciceBudgetaire TODO rename
    public idSubvention: string; // nomProvider-idSubventionProvider
    public idSubventionProvider: string;
    public idJointure?: string;
    public descriptionIdJointure?: string;
    public provider: string;
    public nomAttribuant?: string;
    public typeIdAttribuant?: StructureIdType;
    public idAttribuant?: string;
    public nomAutoriteGestion?: string;
    public idAutoriteGestion?: string;
    public typeIdAutoriteGestion?: StructureIdType;
    public nomServiceInstructeur?: string;
    public typeIdServiceInstructeur?: StructureIdType;
    public idServiceInstructeur?: string;
    public idBeneficiaire: string;
    public typeIdBeneficiaire?: string;
    public exerciceBudgetaire: number;
    public pluriannualite?: boolean;
    public anneesPluriannualite?: number[];
    public dateDecision?: Date;
    public dateConvention: Date;
    public referenceDecision?: string;
    public dateDepotDemande?: Date;
    public anneeDemande?: number;
    public dispositif?: string;
    public sousDispositif?: string;
    public statutLabel: ApplicationStatus;
    public objet?: string; // "Fonctionnement global" or actions. Actions should be handled with ActionFlat enventually
    public nature?: ApplicationNature;
    public montantDemande: number;
    public montantAccorde?: number;
    public montantTotal?: number;
    public ej?: string;
    public idVersement?: string;
    public conditionsVersements?: PaymentCondition;
    public descriptionConditionsVersements?: string;
    public datesPeriodeVersement?: Date | Date[]; // TODO ?
    public cofinancementsSollicites?: boolean;
    public nomsAttribuantsCofinanceurs?: string[];
    public typeIdCofinanceursSollicites?: StructureIdType[];
    public idCofinanceursSollicites?: string[];
    public idRAE?: string;
    public notificationUE?: boolean;
    public pourcentageSubvention?: number;

    constructor(asObject: ApplicationFlatDraft) {
        this.idSubventionProvider = asObject.idSubventionProvider;
        this.idJointure = asObject.idJointure;
        this.descriptionIdJointure = asObject.descriptionIdJointure;
        this.provider = asObject.provider;
        this.nomAttribuant = asObject.nomAttribuant;
        this.typeIdAttribuant = asObject.typeIdAttribuant;
        this.idAttribuant = asObject.idAttribuant;
        this.nomAutoriteGestion = asObject.nomAutoriteGestion;
        this.idAutoriteGestion = asObject.idAutoriteGestion;
        this.typeIdAutoriteGestion = asObject.typeIdAutoriteGestion;
        this.nomServiceInstructeur = asObject.nomServiceInstructeur;
        this.typeIdServiceInstructeur = asObject.typeIdServiceInstructeur;
        this.idServiceInstructeur = asObject.idServiceInstructeur;
        this.idBeneficiaire = asObject.idBeneficiaire;
        this.typeIdBeneficiaire = asObject.typeIdBeneficiaire;
        this.exerciceBudgetaire = asObject.exerciceBudgetaire;
        this.pluriannualite = asObject.pluriannualite;
        this.anneesPluriannualite = asObject.anneesPluriannualite;
        this.dateDecision = asObject.dateDecision;
        this.dateConvention = asObject.dateConvention;
        this.referenceDecision = asObject.referenceDecision;
        this.dateDepotDemande = asObject.dateDepotDemande;
        this.anneeDemande = asObject.anneeDemande;
        this.dispositif = asObject.dispositif;
        this.sousDispositif = asObject.sousDispositif;
        this.statutLabel = asObject.statutLabel;
        this.objet = asObject.objet;
        this.nature = asObject.nature;
        this.montantDemande = asObject.montantDemande;
        this.montantAccorde = asObject.montantAccorde;
        this.montantTotal = asObject.montantTotal;
        this.ej = asObject.ej;
        this.idVersement = asObject.idVersement;
        this.conditionsVersements = asObject.conditionsVersements;
        this.descriptionConditionsVersements = asObject.descriptionConditionsVersements;
        this.datesPeriodeVersement = asObject.datesPeriodeVersement;
        this.cofinancementsSollicites = asObject.cofinancementsSollicites;
        this.nomsAttribuantsCofinanceurs = asObject.nomsAttribuantsCofinanceurs;
        this.typeIdCofinanceursSollicites = asObject.typeIdCofinanceursSollicites;
        this.idCofinanceursSollicites = asObject.idCofinanceursSollicites;
        this.idRAE = asObject.idRAE;
        this.notificationUE = asObject.notificationUE;
        this.pourcentageSubvention = asObject.pourcentageSubvention;

        this.idSubvention = `${this.provider}-${this.idSubventionProvider}`;
        this.idUnique = `${this.idSubvention} - ${this.exerciceBudgetaire}`;
    }

    get siret() {
        if (this.typeIdBeneficiaire === "siret") return new Siret(this.idBeneficiaire);
        return undefined;
    }

    get siren() {
        if (this.typeIdBeneficiaire === "siren") return new Siren(this.idBeneficiaire);
        if (this.typeIdBeneficiaire === "siret") return new Siret(this.idBeneficiaire.slice(0, 9));
        return undefined;
    }
}
// careful, autoriteGestion != serviceInstructeur != attribuant
// for all typeId properties,
type ApplicationFlatDraft = {
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
    typeIdBeneficiaire?: string;
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
