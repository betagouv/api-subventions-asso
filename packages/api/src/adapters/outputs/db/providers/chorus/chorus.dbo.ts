import { ProviderDataEntity } from "../../../../../@types/ProviderData";

export default interface ChorusDbo extends ProviderDataEntity {
    ej: string;
    numPosteEJ: string;
    siret: string;
    ridetOrTahitiet: string;
    codeBranche: string;
    branche: string;
    activitee: string;
    codeActivitee: string;
    numeroDemandePaiement: string;
    numPosteDP: string;
    codeSociete: string;
    exercice: number;
    numeroTier: string;
    nomStructure: string;
    centreFinancier: string;
    codeCentreFinancier: string;
    domaineFonctionnel: string;
    codeDomaineFonctionnel: string;
    montant: number;
    dateOperation: Date;
}

export type ChorusFseDbo = Omit<ChorusDbo, "ej" | "numPosteEJ"> & { ej: "#"; numPosteEJ: "#" };
