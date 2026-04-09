import heliosAdapter from "../../../../adapters/outputs/db/providers/helios/helios.adapter";
import { SaveHeliosDataUseCase } from "./save-helios-data.use-case";
import TransformHeliosDtoToEntityUseCase from "./transform-helios-dto-to-entity.use-case";

export default function createSaveHeliosDataUseCase() {
    const transformUseCase = new TransformHeliosDtoToEntityUseCase();
    const saveUseCase = new SaveHeliosDataUseCase(transformUseCase, heliosAdapter);

    return saveUseCase;
}
