import { SiretDto } from "dto";
export type ScdlGrantEntity = {
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
};

export type EnhancedScdlGrantEntity = ScdlGrantEntity & { exercice: string };
