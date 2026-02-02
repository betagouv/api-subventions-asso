import { ApplicationNature, ApplicationStatus, NOT_APPLICABLE, OrDefault, PaymentCondition } from "dto";
import { IdentifierIdName } from "../../identifierObjects/@types/IdentifierName";
import { ProviderDataEntity } from "../../@types/ProviderData";

// TODO where to accept null ?

interface MandatoryApplicationFlatEntity extends ProviderDataEntity {
    uniqueId: string;
    applicationId: string;
    applicationProviderId: string;
    provider: string;
    beneficiaryEstablishmentId: string;
    beneficiaryEstablishmentIdType: string;
    statusLabel: ApplicationStatus;
    requestedAmount: number | null;
    grantedAmount: number | null;
    budgetaryYear: number | null; // only optionnal for Subventia
}

type OptionalApplicationFlatEntity = {
    joinKeyId: string;
    joinKeyDesc: string;
    allocatorName: string;
    allocatorIdType: IdentifierIdName;
    allocatorId: string;
    managingAuthorityName: string;
    managingAuthorityId: string;
    managingAuthorityIdType: IdentifierIdName;
    instructiveDepartmentName: string;
    instructiveDepartmentIdType: IdentifierIdName;
    instructiveDepartementId: string;
    pluriannual: boolean;
    pluriannualYears: number[];
    decisionDate: Date;
    conventionDate: Date;
    decisionReference: string;
    depositDate: Date;
    requestYear: number;
    scheme: string; // dispositif
    subScheme: string; // sous dispositif
    object: string;
    nature: ApplicationNature;
    totalAmount: number;
    ej: string;
    paymentId: string;
    paymentCondition: PaymentCondition;
    paymentConditionDesc: string;
    paymentPeriodDates: Date[];
    cofinancingRequested: boolean;
    cofinancersNames: string[];
    cofinancersIdType: IdentifierIdName[];
    confinancersId: string[];
    idRAE: string;
    ueNotification: boolean;
    subventionPercentage: number;
};

export type ApplicationFlatEntity = MandatoryApplicationFlatEntity &
    OrDefault<OptionalApplicationFlatEntity, NOT_APPLICABLE | null>;
