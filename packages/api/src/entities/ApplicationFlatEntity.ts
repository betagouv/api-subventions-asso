import { ApplicationStatus } from "dto";
import { NOT_APPLICABLE } from "../shared/GenericAdapter";

import { IdentifierIdName } from "../identifierObjects/@types/IdentifierName";

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

type OrNA<FlatType> = {
    [prop in keyof FlatType]: FlatType[prop] | NOT_APPLICABLE;
};

// careful, autoriteGestion != serviceInstructeur != attribuant
// for all typeId properties,
export type FullApplicationFlatEntity = {
    uniqueId: string;
    applicationId: string;
    applicationProviderId: string;
    joinKeyId?: string;
    joinKeyDesc?: string;
    provider: string;
    allocatorName?: string;
    allocatorIdType?: IdentifierIdName;
    allocatorId?: string;
    managingAuthorityName?: string;
    managingAuthorityId?: string;
    managingAuthorityIdType?: IdentifierIdName;
    instructiveDepartmentName?: string;
    instructiveDepartmentIdType?: IdentifierIdName;
    instructiveDepartementId?: string;
    beneficiaryEstablishmentId: string;
    beneficiaryEstablishmentIdType?: string;
    budgetaryYear: number;
    pluriannual?: boolean;
    pluriannualYears?: number[];
    decisionDate?: Date;
    conventionDate: Date;
    decisionReference?: string;
    depositDate?: Date;
    requestYear?: number;
    scheme?: string; // dispositif
    subScheme?: string; // sous dispositif
    statusLabel: ApplicationStatus;
    object?: string;
    nature?: ApplicationNature;
    requestedAmount: number;
    grantedAmount?: number;
    totalAmount?: number;
    ej?: string;
    paymentId?: string;
    paymentCondition?: PaymentCondition;
    paymentConditionDesc?: string;
    paymentPeriodDates?: Date | Date[];
    cofinancingRequested?: boolean;
    cofinancersNames?: string[];
    cofinancersIdType?: IdentifierIdName[];
    confinancersId?: string[];
    idRAE?: string;
    ueNotification?: boolean;
    subventionPercentage?: number;
    updateDate: Date;
};

export type ApplicationFlatEntity = OrNA<FullApplicationFlatEntity>;
