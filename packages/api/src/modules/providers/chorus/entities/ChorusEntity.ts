import { ProviderDataEntity } from "../../../../@types/ProviderData";

export default interface ChorusEntity extends ProviderDataEntity {
    ej: string;
    numPosteEJ: number;
    // @TODO: make it a Siret
    siret: string;
    ridetOrTahitiet: string;
    codeBranche: string;
    branche: string;
    activitee: string;
    codeActivitee: string;
    numeroDemandePaiement: string;
    numPosteDP: string | number;
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
