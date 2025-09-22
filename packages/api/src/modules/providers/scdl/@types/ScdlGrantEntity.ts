import { SiretDto } from "dto";
import type { ProviderDataEntity } from "../../../../@types/ProviderData";
export interface ScdlGrantEntity extends ProviderDataEntity {
    allocatorName: string;
    allocatorSiret: SiretDto;
    exercice: number;
    amount: number;
    associationSiret: string;
    associationName?: string;
    associationRna?: string;
    object?: string;
    conventionDate?: Date;
    decisionReference?: string;
    paymentNature?: string;
    paymentConditions?: string;
    paymentStartDate?: Date;
    paymentEndDate?: Date;
    idRAE?: string;
    UeNotification?: boolean;
    grantPercentage?: number;
    aidSystem?: string;
}
