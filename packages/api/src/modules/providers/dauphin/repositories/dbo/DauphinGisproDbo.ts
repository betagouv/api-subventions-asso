import Gispro from "../../../gispro/@types/Gispro";
import DauphinSubventionDto from "../../dto/DauphinSubventionDto";

export default interface DauphinGisproDbo {
    gispro?: Gispro;
    dauphin: DauphinSubventionDto;
}
