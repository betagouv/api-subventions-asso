import { MandatoryFlatEntity } from "./FlatEntity";

interface PaymentFlatEntity extends MandatoryFlatEntity {
    idVersement: string;
    exerciceBudgetaire: number;
    amount: number;
    operationDate: Date;
    financialCenterCode: string;
    financialCenterLabel: string | null;
    accountingAttachment: string;
    accountingAttachmentRegion: string | null;
    programName: string | null;
    programNumber: number;
    mission: string | null;
    ministry: string | null;
    ministryAcronym: string | null;
    actionCode: string | null;
    actionLabel: string | null;
    activityCode: string | null;
    activityLabel: string | null;
    ej: string | null; // FONJEP doesn't use EJ
}

export default PaymentFlatEntity;
