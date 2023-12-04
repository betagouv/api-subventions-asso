import { Siren, Siret } from "dto";
import { ObjectId } from "mongodb";
import { InseeAddress } from "../../../entities/InseeEstablishmentEntity";

type InseeEstablishmentDbo = {
    _id?: ObjectId;
    siren: Siren;
    siret: Siret;
    nic: string;
    lastUpdate: Date;
    siege: boolean;
    ouvert: boolean;
    adresse: InseeAddress;
};

export default InseeEstablishmentDbo;
