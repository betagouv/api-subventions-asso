import { ApplicationStatus } from "dto";
import { ApplicationFlatEntity } from "../../../../entities/flats/ApplicationFlatEntity";
import Siret from "../../../../identifier-objects/Siret";
import HeliosEntity from "../domain/helios.entity";

export default class ExtractHeliosApplicationFlatSpecificFields {
    constructor() {}

    execute(entity: HeliosEntity) {
        const applicationProviderId = `${entity.codeInseeBc}-${entity.numMandat}`;
        const applicationId = `helios-${applicationProviderId}`;

        return {
            allocatorName: entity.collec,
            allocatorIdType: Siret.getName(),
            applicationId,
            applicationProviderId,
            statusLabel: ApplicationStatus.GRANTED,
            requestedAmount: null,
            grantedAmount: entity.montantPaiment,
            paymentId: entity.id,
        } as Omit<
            ApplicationFlatEntity,
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
