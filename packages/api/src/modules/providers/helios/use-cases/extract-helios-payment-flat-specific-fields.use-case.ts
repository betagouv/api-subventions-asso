import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
import HeliosEntity from "../domain/helios.entity";

export default class ExtractHeliosPaymentFlatSpecificFieldsUseCase {
    constructor() {}

    execute(entity: HeliosEntity) {
        return {
            paymentId: entity.id,
            amount: entity.montantPaiment,
            operationDate: entity.datePaiement,
            financialCenterCode: GenericAdapter.NOT_APPLICABLE_VALUE,
            financialCenterLabel: GenericAdapter.NOT_APPLICABLE_VALUE,
            accountingAttachment: GenericAdapter.NOT_APPLICABLE_VALUE,
            accountingAttachmentRegion: GenericAdapter.NOT_APPLICABLE_VALUE,
            programName: GenericAdapter.NOT_APPLICABLE_VALUE,
            programNumber: GenericAdapter.NOT_APPLICABLE_VALUE,
            mission: GenericAdapter.NOT_APPLICABLE_VALUE,
            ministry: GenericAdapter.NOT_APPLICABLE_VALUE,
            ministryAcronym: GenericAdapter.NOT_APPLICABLE_VALUE,
            actionCode: GenericAdapter.NOT_APPLICABLE_VALUE,
            actionLabel: GenericAdapter.NOT_APPLICABLE_VALUE,
            activityCode: GenericAdapter.NOT_APPLICABLE_VALUE,
            activityLabel: GenericAdapter.NOT_APPLICABLE_VALUE,
            ej: GenericAdapter.NOT_APPLICABLE_VALUE,
        } as Omit<
            PaymentFlatEntity,
            | "updateDate"
            | "provider"
            | "budgetaryYear"
            | "beneficiaryCompanyId"
            | "beneficiaryCompanyIdType"
            | "beneficiaryEstablishmentId"
            | "beneficiaryEstablishmentIdType"
        >;
    }
}
