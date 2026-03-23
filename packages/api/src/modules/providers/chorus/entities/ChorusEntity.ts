import { ProviderDataEntity } from "../../../../@types/ProviderData";

export default interface ChorusEntity extends ProviderDataEntity {
    uniqueId: string;
    ej: string;
    numPosteEJ: number;
    siret: string;
    ridetOrTahitiet: string;
    codeBranche: string;
    branche: string;
    activitee: string;
    codeActivitee: string;
    numeroDemandePaiement: string;
    numPosteDP: number;
    codeSociete: string;
    exercice: number;
    numeroTier: string;
    nomStructure: string;
    centreFinancier: string;
    codeCentreFinancier: string;
    domaineFonctionnel: string;
    codeDomaineFonctionnel: string;
    amount: number;
    dateOperation: Date;
}
