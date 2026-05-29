import heliosAdapter from "../../../../adapters/outputs/db/providers/helios/helios.adapter";
import applicationFlatService from "../../../application-flat/application-flat.service";
import paymentFlatService from "../../../payment-flat/payment-flat.service";
import ExtractHeliosBeneficaryInfosUseCase from "./extract-helios-beneficary-info.use-case";
import SaveHeliosDataUseCase from "./save-helios-data.use-case";
import SaveHeliosEntitiesToFlatUseCase from "./save-helios-entities-to-flat.use-case";
import TransformHeliosEntitiesToFlat from "./transform-helios-entities-to-flat.use-case";
import ExtractHeliosApplicationFlatSpecificFields from "./extract-helios-application-flat-specific-fields.use-case";
import ExtractHeliosPaymentFlatSpecificFieldsUseCase from "./extract-helios-payment-flat-specific-fields.use-case";

import getIdentifierFromString from "../../../associations/use-cases/get-identifier-from-string.use-case";
import checkIdentifierIsFromAsso from "../../../associations/use-cases/check-identifier-is-from-asso.use-case";
import findSiretFromAssoIdentifier from "../../../associations/use-cases/find-siret-from-association-identifier.use-case";

export default function createSaveHeliosDataUseCase() {
    const extractBeneficiaryInfos = new ExtractHeliosBeneficaryInfosUseCase(findSiretFromAssoIdentifier);
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
        getIdentifierFromString,
        checkIdentifierIsFromAsso,
        saveFlatUseCase,
        heliosAdapter,
    );
    return saveUseCase;
}
