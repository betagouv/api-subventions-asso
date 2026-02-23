import GisproEntity from "../../../../modules/providers/dauphin-gispro/@types/GisproEntity";
import DauphinSubventionDto from "../../../../modules/providers/dauphin-gispro/dto/DauphinSubventionDto";

// @TODO: make it extends ProviderDataEntity
export default interface DauphinGisproDbo {
    gispro?: GisproEntity;
    dauphin: DauphinSubventionDto;
}
