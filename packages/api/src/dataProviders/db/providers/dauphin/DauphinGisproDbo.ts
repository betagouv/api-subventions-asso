import Gispro from "../../../../modules/providers/gispro/@types/Gispro";
import DauphinSubventionDto from "../../../../modules/providers/dauphin/dto/DauphinSubventionDto";

export default interface DauphinGisproDbo {
    gispro?: Gispro;
    dauphin: DauphinSubventionDto;
}
