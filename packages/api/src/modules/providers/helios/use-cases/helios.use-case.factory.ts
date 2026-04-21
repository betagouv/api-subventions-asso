import heliosAdapter from "../../../../adapters/outputs/db/providers/helios/helios.adapter";
import applicationFlatService from "../../../application-flat/application-flat.service";
import paymentFlatService from "../../../payment-flat/payment-flat.service";
import ExtractHeliosBeneficaryInfosUseCase from "./extract-helios-beneficary-info.use-case";
import SaveHeliosDataUseCase from "./save-helios-data.use-case";
import SaveHeliosEntitiesToFlatUseCase from "./save-helios-entities-to-flat.use-case";
import TransformHeliosEntitiesToFlat from "./transform-helios-entities-to-flat.use-case";
import ExtractHeliosApplicationFlatSpecificFields from "./extract-helios-application-flat-specific-fields.use-case";
import ExtractHeliosPaymentFlatSpecificFieldsUseCase from "./extract-helios-payment-flat-specific-fields.use-case";
import {
    createCheckIdentifierIsFromAsso,
    createFindSiretFromAssociationIdentifier,
} from "../../../associations/use-cases/association.use-case.factory";
import GetIdentifierFromStringUseCase from "../../../associations/use-cases/get-identifier-from-string.use-case";

export default function createSaveHeliosDataUseCase() {
    const extractBeneficiaryInfos = new ExtractHeliosBeneficaryInfosUseCase(createFindSiretFromAssociationIdentifier());
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

    const saveUseCase = new SaveHeliosDataUseCase(
        new GetIdentifierFromStringUseCase(),
        createCheckIdentifierIsFromAsso(),
        saveFlatUseCase,
        heliosAdapter,
    );
    return saveUseCase;
}
