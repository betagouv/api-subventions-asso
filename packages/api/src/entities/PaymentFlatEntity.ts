import { ProviderDataEntity } from "../@types/ProviderData";
import { CompanyIdName, EstablishmentIdName } from "../identifierObjects/@types/IdentifierName";
import { CompanyIdType, EstablishmentIdType } from "../identifierObjects/@types/IdentifierType";

interface PaymentFlatEntity extends ProviderDataEntity {
    idVersement: string;
    uniqueId: string;
    exerciceBudgetaire: number;
    typeIdEtablissementBeneficiaire: EstablishmentIdName;
    idEtablissementBeneficiaire: EstablishmentIdType;
    typeIdEntrepriseBeneficiaire: CompanyIdName;
    idEntrepriseBeneficiaire: CompanyIdType;
    amount: number;
    operationDate: Date;
    centreFinancierCode: string;
    centreFinancierLibelle: string | null;
    attachementComptable: string;
    regionAttachementComptable: string;
    programName: string | null;
    programNumber: number;
    mission: string | null;
    ministry: string | null;
    ministryAcronym: string | null;
    actionCode: string | null;
    actionLabel: string | null;
    activityCode: string | null;
    activityLabel: string | null;
    provider: string;
    // don't know why ej is nullable. It is part of idVersement and should be mandatory
    ej: string | null;
}

export default PaymentFlatEntity;
