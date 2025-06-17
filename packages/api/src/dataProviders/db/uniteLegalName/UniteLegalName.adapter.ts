import { WithoutId } from "mongodb";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";
import Siren from "../../../identifierObjects/Siren";
import UniteLegalNameDbo from "./UniteLegalNameDbo";

export default class UniteLegalNameAdapter {
    static toEntity(dbo: UniteLegalNameDbo): UniteLegalNameEntity {
        return new UniteLegalNameEntity(
            new Siren(dbo.siren),
            dbo.name,
            dbo.searchKey,
            dbo.updatedDate,
            dbo._id?.toString(),
        );
    }

    static toDbo(entity: UniteLegalNameEntity): WithoutId<UniteLegalNameDbo> {
        return {
            siren: entity.siren.value,
            name: entity.name,
            searchKey: entity.searchKey,
            updatedDate: entity.updatedDate,
        };
    }

    static buildSearchKey(siren: Siren, name: string) {
        const nameLc = name.toLowerCase();
        let key = `${siren.value} - ${nameLc}`;
        const removeAccents = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accent on name for futur search
        const nameWithoutAccent = removeAccents(nameLc);

        if (nameLc != nameWithoutAccent) {
            key += ` - ${nameWithoutAccent}`;
        }

        return key;
    }
}
