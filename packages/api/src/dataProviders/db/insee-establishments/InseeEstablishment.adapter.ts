import { WithoutId } from "mongodb";
import { InseeAddress, InseeEstablishmentEntity } from "../../../entities/InseeEstablishmentEntity";
import InseeEstablishmentDbo from "./InseeEstablishmentDbo";

export default class InseeEstablishmentAdapter {
    static toAddressEntity(dbo: InseeEstablishmentDbo) {
        return new InseeAddress(dbo.adresse);
    }

    static fromEntity(entity: InseeEstablishmentEntity): WithoutId<InseeEstablishmentDbo> {
        return { ...entity };
    }
}
