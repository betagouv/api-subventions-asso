import { ApplicationFlatEntity } from "../../../../entities/flats/ApplicationFlatEntity";
import { MandatoryFlatEntity } from "../../../../entities/flats/FlatEntity";
import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";
import HeliosEntity from "../domain/helios.entity";
import ExtractBeneficaryInfosUseCase from "./extract-helios-beneficary-info.use-case";
import ExtractHeliosApplicationFlatSpecificFields from "./extract-helios-application-flat-specific-fields.use-case";
import ExtractHeliosPaymentFlatSpecificFieldsUseCase from "./extract-helios-payment-flat-specific-fields.use-case";

export class TransformHeliosEntitiesToFlat {
    constructor(
        private extractBeneficiaryInfos: ExtractBeneficaryInfosUseCase,
        private extractPaymentSpecifics: ExtractHeliosPaymentFlatSpecificFieldsUseCase,
        private extractApplicationSpecifics: ExtractHeliosApplicationFlatSpecificFields,
    ) {}
    execute(
        entities: HeliosEntity[],
    ): Promise<{ payments: PaymentFlatEntity[]; applications: ApplicationFlatEntity[] }> {
        return entities.reduce(
            async (acc, entity) => {
                const flats = await acc;
                try {
                    const beneficaryInfos = await this.extractBeneficiaryInfos.execute(entity);
                    const commonFields: MandatoryFlatEntity & { budgetaryYear: number } = {
                        provider: "helios",
                        uniqueId: entity.id,
                        budgetaryYear: entity.datePaiement.getFullYear(),
                        ...beneficaryInfos,
                        updateDate: entity.updateDate,
                    };
                    flats.payments.push({ ...commonFields, ...(await this.extractPaymentSpecifics.execute(entity)) });
                    flats.applications.push({
                        ...commonFields,
                        ...(await this.extractApplicationSpecifics.execute(entity)),
                    });
                    return flats;
                } catch (e) {
                    console.log(e);
                    // ignore errors
                }
                return flats;
            },
            Promise.resolve({ payments: [] as PaymentFlatEntity[], applications: [] as ApplicationFlatEntity[] }),
        );
    }
}
