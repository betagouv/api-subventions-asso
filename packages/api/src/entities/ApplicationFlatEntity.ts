import { ApplicationStatus } from "dto";
import { NOT_APPLICABLE } from "../shared/GenericAdapter";

import { IdentifierIdName } from "../identifierObjects/@types/IdentifierName";
import { OrDefault } from "../shared/helpers/TypeHelper";

export enum ApplicationNature {
    MONEY = "MONEY",
    NATURE = "NATURE",
}

export enum PaymentCondition {
    UNIQUE = "UNIQUE",
    PHASED = "PHASED",
    OTHER = "OTHER",
}

// TODO where to accept null ?

type MandatoryApplicationFlatEntity = {
    uniqueId: string;
    applicationId: string;
    applicationProviderId: string;
    provider: string;
    beneficiaryEstablishmentId: string;
    beneficiaryEstablishmentIdType: string;
    budgetaryYear: number;
    statusLabel: ApplicationStatus;
    requestedAmount: number | null;
    grantedAmount: number | null;
    updateDate: Date;
};

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
