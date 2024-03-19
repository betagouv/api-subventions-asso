import { Siret } from "dto";

export default interface MiscScdlProducerEntity {
    id: string;
    name: string;
    siret: Siret;
    lastUpdate: Date;
}
