import { ScdlGrantEntity } from "../@types/ScdlGrantEntity";
import MiscScdlProducerEntity from "./MiscScdlProducerEntity";

export default interface MiscScdlGrantProducerEntity extends ScdlGrantEntity {
    producerSlug: string;
    producer: MiscScdlProducerEntity;
}
