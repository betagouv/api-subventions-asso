import { Siret } from "dto";

export default interface MiscScdlProducerEntity {
    slug: string;
    name: string;
    siret: Siret;
    lastUpdate: Date;
}
