import GisproEntity from "../../../../modules/providers/dauphin-gispro/@types/GisproEntity";
import DauphinSubventionDto from "../../../../modules/providers/dauphin-gispro/dto/DauphinSubventionDto";

export default interface DauphinGisproDbo {
    gispro?: GisproEntity;
    dauphin: DauphinSubventionDto;
}
