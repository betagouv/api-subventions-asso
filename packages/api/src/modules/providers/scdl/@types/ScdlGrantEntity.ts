import { SiretDto } from "dto";
export type ScdlGrantEntity = {
    allocatorName: string;
    allocatorSiret: SiretDto;
    exercice: number;
    conventionDate?: Date;
    decisionReference?: string;
    associationName?: string;
    associationSiret: string;
    associationRna?: string;
    object?: string;
    amount: number;
    paymentNature: string;
    paymentConditions?: string;
    paymentStartDate?: Date;
    paymentEndDate?: Date;
    idRAE?: string;
    UeNotification?: boolean;
    grantPercentage?: number;
    aidSystem?: string;
};

export type EnhancedScdlGrantEntity = ScdlGrantEntity & { exercice: string };
