import { ApplicationStatus, Siret } from "dto";
import { ObjectId } from "mongodb";

export default interface ApplicationsFlatDbo {
    _id: ObjectId;
    provider: string;
    idSubvention: string | null;
    nomAttribuant: string;
    idAttribuant: Siret;
    nomServiceInstructeur: string | null;
    idServiceInstructeur: Siret | null;
    nomBeneficiaire: string;
    idBeneficiaire: Siret;
    exerciceBudgetaire: number;
    pluriannualite: boolean;
    anneesPluriannualites: number[];
    dateDecision: Date | null;
    dateConvention: Date;
    referenceDecision: string | null;
    dateCreation: Date | null;
    dateDebut: Date | null;
    dateFin: Date | null;
    dispositif: string | null;
    sousDispositif: string | null;
    statutLabel: ApplicationStatus;
    objet: string | null;
    nature: string | null; // only valid "aide en numéraie" or "aide en nature"
    montantDemande: number;
    montantAccorde: number | null;
    ej: string | null;
    cleVersement: string | null;
    conditionsVersement: string | null;
    datesPeriodeVersement: Date[] | null;
    cofinancement: string | null;
    attribuantsCofinanceurs: string[] | null;
    idCofinancement: string | null;
    notificationUE: boolean;
    evaluationCout: number | null;
    evaluation: string | null;
}
