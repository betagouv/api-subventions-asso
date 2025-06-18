import { ApplicationStatus } from "dto";
import { companyIdName, establishmentIdName } from "../valueObjects/typeIdentifier";

export type StructureIdType = companyIdName | establishmentIdName;

export enum ApplicationNature {
    MONEY = "MONEY",
    NATURE = "NATURE",
}

export enum PaymentCondition {
    UNIQUE = "UNIQUE",
    PHASED = "PHASED",
    OTHER = "OTHER",
}

export type ApplicationFlatEntity = {
    uniqueId: string;
    applicationId: string;
    applicationProviderId: string;
    joinKeyId?: string;
    joinKeyDesc?: string;
    provider: string;
    allocatorName?: string;
    allocatorIdType?: StructureIdType;
    allocatorId?: string;
    managingAuthorityName?: string;
    managingAuthorityId?: string;
    managingAuthorityIdType?: StructureIdType;
    instructiveDepartmentName?: string;
    instructiveDepartmentIdType?: StructureIdType;
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
    cofinancersIdType?: StructureIdType[];
    confinancersId?: string[];
    idRAE?: string;
    ueNotification?: boolean;
    subventionPercentage?: number;
};
