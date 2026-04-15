import { ApplicationFlatEntity } from "../../../../entities/flats/ApplicationFlatEntity";
import { MandatoryFlatEntity } from "../../../../entities/flats/FlatEntity";
import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";
import HeliosEntity from "../domain/helios.entity";
import ExtractBeneficaryInfosUseCase from "./extract-helios-beneficary-info.use-case";
import ExtractHeliosApplicationFlatSpecificFields from "./extract-helios-application-flat-specific-fields.use-case";
import ExtractHeliosPaymentFlatSpecificFieldsUseCase from "./extract-helios-payment-flat-specific-fields.use-case";

export default class TransformHeliosEntitiesToFlat {
    constructor(
        private extractBeneficiaryInfos: ExtractBeneficaryInfosUseCase,
        private extractPaymentSpecifics: ExtractHeliosPaymentFlatSpecificFieldsUseCase,
        private extractApplicationSpecifics: ExtractHeliosApplicationFlatSpecificFields,
    ) {}
    async execute(
        entities: HeliosEntity[],
    ): Promise<{ payments: PaymentFlatEntity[]; applications: ApplicationFlatEntity[] }> {
        let nbErrors = 0;
        const promise = await entities.reduce(
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
                    flats.payments.push({ ...commonFields, ...this.extractPaymentSpecifics.execute(entity) });
                    flats.applications.push({
                        ...commonFields,
                        ...this.extractApplicationSpecifics.execute(entity),
                    });
                    return flats;
                } catch (e) {
                    // @TODO: list errors ?
                    console.log(e);
                    nbErrors++;
                }
                return flats;
            },
            Promise.resolve({ payments: [] as PaymentFlatEntity[], applications: [] as ApplicationFlatEntity[] }),
        );
        if (nbErrors > 0) console.error(`${nbErrors} helios entities were not transformed`);
        return promise;
    }
}
