import { companyIdType, establishmentIdType, companyIdName, establishmentIdName } from "../valueObjects/typeIdentifier";

type PaymentFlatEntity = {
    idVersement: string;
    uniqueId: string;
    exerciceBudgetaire: number;
    typeIdEtablissementBeneficiaire: establishmentIdName;
    idEtablissementBeneficiaire: establishmentIdType;
    typeIdEntrepriseBeneficiaire: companyIdName;
    idEntrepriseBeneficiaire: companyIdType;
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
};

export default PaymentFlatEntity;
