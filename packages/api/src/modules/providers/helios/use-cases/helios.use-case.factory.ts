import sireneStockUniteLegaleAdapter from "../../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.adapter";
import heliosAdapter from "../../../../adapters/outputs/db/providers/helios/helios.adapter";
import applicationFlatService from "../../../application-flat/application-flat.service";
import paymentFlatService from "../../../payment-flat/payment-flat.service";
import ExtractHeliosBeneficaryInfosUseCase from "./extract-helios-beneficary-info.use-case";
import { SaveHeliosDataUseCase } from "./save-helios-data.use-case";
import SaveHeliosEntitiesToFlatUseCase from "./save-helios-entities-to-flat.use-case";
import TransformHeliosDtoToEntityUseCase from "./transform-helios-dto-to-entity.use-case";
import { TransformHeliosEntitiesToFlat } from "./transform-helios-entities-to-flat.use-case";
import ExtractHeliosApplicationFlatSpecificFields from "./extract-helios-application-flat-specific-fields.use-case";
import ExtractHeliosPaymentFlatSpecificFieldsUseCase from "./extract-helios-payment-flat-specific-fields.use-case";

export default function createSaveHeliosDataUseCase() {
    const transformUseCase = new TransformHeliosDtoToEntityUseCase();

    const extractBeneficiaryInfos = new ExtractHeliosBeneficaryInfosUseCase(sireneStockUniteLegaleAdapter);
    const extractPaymentSpecifics = new ExtractHeliosPaymentFlatSpecificFieldsUseCase();
    const extractApplicationSpecifics = new ExtractHeliosApplicationFlatSpecificFields();
    const transformToFlatsUseCase = new TransformHeliosEntitiesToFlat(
        extractBeneficiaryInfos,
        extractPaymentSpecifics,
        extractApplicationSpecifics,
    );
    const saveFlatUseCase = new SaveHeliosEntitiesToFlatUseCase(
        transformToFlatsUseCase,
        applicationFlatService,
        paymentFlatService,
    );
    const saveUseCase = new SaveHeliosDataUseCase(transformUseCase, saveFlatUseCase, heliosAdapter);
    return saveUseCase;
}
