import { ScdlGrantEntity } from "../@types/ScdlGrantEntity";
import MiscScdlProducerEntity from "./MiscScdlProducerEntity";

export default interface MiscScdlGrantProducerEntity extends ScdlGrantEntity {
    producerId: string;
    producer: MiscScdlProducerEntity;
}
