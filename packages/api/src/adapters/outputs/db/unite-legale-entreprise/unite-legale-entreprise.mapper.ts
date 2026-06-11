import { ObjectId } from "mongodb";
import { UniteLegaleEntrepriseEntity } from "../../../../entities/UniteLegaleEntrepriseEntity";
import Siren from "../../../../identifier-objects/Siren";
import { UniteLegaleEntrepriseDbo } from "./@types/UniteLegaleEntrepriseDbo";

export class UniteLegaleEntrepriseMapper {
    static toEntity(dbo: UniteLegaleEntrepriseDbo): UniteLegaleEntrepriseEntity {
        return new UniteLegaleEntrepriseEntity(new Siren(dbo.siren), dbo._id.toString());
    }

    static toDbo(entity: UniteLegaleEntrepriseEntity): UniteLegaleEntrepriseDbo {
        return {
            siren: entity.siren.value,
            _id: new ObjectId(entity.id),
        };
    }
}
