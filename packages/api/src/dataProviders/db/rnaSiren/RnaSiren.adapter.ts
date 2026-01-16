import { ObjectId } from "mongodb";
import RnaSirenEntity from "../../../entities/RnaSirenEntity";
import Siren from "../../../identifierObjects/Siren";
import Rna from "../../../identifierObjects/Rna";
import RnaSirenDbo from "./RnaSirenDbo";

export default class RnaSirenAdapter {
    static toDbo(entity: RnaSirenEntity): RnaSirenDbo {
        return {
            _id: new ObjectId(),
            rna: entity.rna.value,
            siren: entity.siren.value,
        };
    }

    static toEntity(dbo: RnaSirenDbo): RnaSirenEntity {
        // TOUGHTS: do we really want to keep the ID here ?
        return new RnaSirenEntity(new Rna(dbo.rna), new Siren(dbo.siren), dbo._id.toString());
    }
}
