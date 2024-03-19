import { ScdlGrantEntity } from "../@types/ScdlGrantEntity";
import MiscScdlProducerEntity from "./MiscScdlProducerEntity";

export default interface MiscScdlGrantProducerEntity extends ScdlGrantEntity {
    id: string;
    producer: MiscScdlProducerEntity;
}
