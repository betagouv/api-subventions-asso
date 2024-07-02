import { ScdlGrantEntity } from "../@types/ScdlGrantEntity";
import MiscScdlProducerEntity from "./MiscScdlProducerEntity";

export default interface MiscScdlGrantEntity extends ScdlGrantEntity {
    producerSlug: string;
    producer: MiscScdlProducerEntity;
}
