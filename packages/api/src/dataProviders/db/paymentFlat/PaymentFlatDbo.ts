import { ObjectId } from "mongodb";

export default interface PaymentFlatDbo {
    _id: ObjectId;
    typeIdEtablissementBeneficiaire: string; // ceci peut prendre que les valeurs suivantes siret, ridet, thaiti-t
    idEtablissementBeneficiaire: string; // ceci doit correspondre à un format précis en fonction de la valeur de typeIdEtablissement
    typeIdEntrepriseBeneficiaire: string; // ceci peut prendre que les valeurs suivantes siren, rid, thaiti
    IdEntrepriseBeneficiaire: string; // ceci doit correspondre à un format précis en fonction de la valeur de typeIdEntreprise
    uniqueId: string;
    idVersement: string;
    exerciceBudgetaire: number;
    montant: number;
    dateOperation: Date;
    programme: string | null;
    numeroProgramme: number;
    mission: string | null;
    ministere: string | null;
    sigleMinistere: string | null;
    ej: string;
    provider: string;
    codeAction: string;
    action: string | null;
    codeActivite: string | null;
    activite: string | null;
}
