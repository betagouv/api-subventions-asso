import { ObjectId } from "mongodb";
import { UniteLegalEntrepriseEntity } from "../../../entities/UniteLegalEntrepriseEntity";
import { UniteLegalEntrepriseDbo } from "./UniteLegalEntrepriseDbo";

export class UniteLegalEntrepriseAdapter {
    static toEntity(dbo: UniteLegalEntrepriseDbo): UniteLegalEntrepriseEntity {
        return new UniteLegalEntrepriseEntity(dbo.siren, dbo._id.toString());
    }

    static toDbo(entity: UniteLegalEntrepriseEntity): UniteLegalEntrepriseDbo {
        return {
            siren: entity.siren,
            _id: new ObjectId(entity.id)
        }
    }
}