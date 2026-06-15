import { ProviderDataEntity } from "../../../../@types/ProviderData";
import Siret from "../../../../identifier-objects/Siret";

export default interface ChorusEntity extends ProviderDataEntity {
    uniqueId: string;
    ej: string;
    numPosteEJ: number;
    siret?: Siret;
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

export type ChorusDbo = Omit<ChorusEntity, "siret"> & { siret?: string };
