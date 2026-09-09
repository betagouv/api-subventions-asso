import { WithoutId } from "mongodb";
import UniteLegaleNameEntity from "../../../../entities/UniteLegaleNameEntity";
import Siren from "../../../../identifier-objects/Siren";
import UniteLegalNameDbo from "./@types/UniteLegaleNameDbo";
import Rna from "../../../../identifier-objects/Rna";

export default class UniteLegalNameMapper {
    static toEntity(dbo: UniteLegalNameDbo): UniteLegaleNameEntity {
        return new UniteLegaleNameEntity({
            siren: new Siren(dbo.siren),
            rna: dbo.rna ? new Rna(dbo.rna) : null,
            name: dbo.name,
            searchKey: dbo.searchKey,
            updateDate: dbo.updateDate,
        });
    }

    static toDbo(entity: UniteLegaleNameEntity): WithoutId<UniteLegalNameDbo> {
        return {
            siren: entity.siren.value,
            rna: entity.rna ? entity.rna.value : null,
            name: entity.name,
            searchKey: entity.searchKey,
            updateDate: entity.updateDate,
        };
    }
}
