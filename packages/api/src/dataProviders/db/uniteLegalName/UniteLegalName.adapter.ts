import { ObjectId } from "mongodb";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";
import UniteLegalNameDbo from "./UniteLegalNameDbo";

export default class UniteLegalNameAdapter {
    static toEntity(dbo: UniteLegalNameDbo): UniteLegalNameEntity {
        return new UniteLegalNameEntity(
            dbo.siren,
            dbo.name,
            dbo.searchKey,
            dbo.updatedDate,
            dbo.legalCategory,
            dbo._id?.toString(),
        );
    }

    static toDbo(entity: UniteLegalNameEntity): UniteLegalNameDbo {
        return {
            siren: entity.siren,
            name: entity.name,
            searchKey: entity.searchKey,
            updatedDate: entity.updatedDate,
            legalCategory: entity.legalCategory,
            _id: new ObjectId(entity.id),
        };
    }
}
