import { ObjectId } from "mongodb";
import { UniteLegalEntrepriseEntity } from "../../../entities/UniteLegalEntrepriseEntity";
import Siren from "../../../identifierObjects/Siren";
import { UniteLegalEntrepriseDbo } from "./UniteLegalEntrepriseDbo";

export class UniteLegalEntrepriseMapper {
    static toEntity(dbo: UniteLegalEntrepriseDbo): UniteLegalEntrepriseEntity {
        return new UniteLegalEntrepriseEntity(new Siren(dbo.siren), dbo._id.toString());
    }

    static toDbo(entity: UniteLegalEntrepriseEntity): UniteLegalEntrepriseDbo {
        return {
            siren: entity.siren.value,
            _id: new ObjectId(entity.id),
        };
    }
}
