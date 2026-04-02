import { ObjectId } from "mongodb";
import { UniteLegaleEntrepriseEntity } from "../../../../entities/UniteLegaleEntrepriseEntity";
import Siren from "../../../../identifierObjects/Siren";
import { UniteLegalEntrepriseDbo } from "./@types/UniteLegalEntrepriseDbo";

export class UniteLegalEntrepriseMapper {
    static toEntity(dbo: UniteLegalEntrepriseDbo): UniteLegaleEntrepriseEntity {
        return new UniteLegaleEntrepriseEntity(new Siren(dbo.siren), dbo._id.toString());
    }

    static toDbo(entity: UniteLegaleEntrepriseEntity): UniteLegalEntrepriseDbo {
        return {
            siren: entity.siren.value,
            _id: new ObjectId(entity.id),
        };
    }
}
