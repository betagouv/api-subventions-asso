import { SiretDto } from "dto";
import { ProviderDataEntity } from "../../../../@types/ProviderDataEntity";
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
