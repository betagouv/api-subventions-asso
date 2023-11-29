import { ObjectId } from "mongodb"
import RnaSirenEntity from "../../../entities/RnaSirenEntity";
import RnaSirenDbo from "./RnaSirenDbo";

export default class RnaSirenAdapter {
    static toDbo(entity: RnaSirenEntity): RnaSirenDbo {
        return {
            _id: new ObjectId(entity.id),
            rna: entity.rna,
            siren: entity.siren,
        }
    }
    
    static toEntity(dbo: RnaSirenDbo): RnaSirenEntity {
        return new RnaSirenEntity(
            dbo.rna,
            dbo.siren,
            dbo._id.toString()
        )
    }
}