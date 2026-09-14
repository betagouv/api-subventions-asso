import { WithoutId } from "mongodb";
import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";
import AssociationSearchDbo from "./@types/AssociationSearchDbo";
import Rna from "../../../../identifier-objects/Rna";

export default class AssociationSearchMapper {
    static toEntity(dbo: AssociationSearchDbo): AssociationSearchEntity {
        return new AssociationSearchEntity({
            siren: new Siren(dbo.siren),
            rna: dbo.rna ? new Rna(dbo.rna) : null,
            name: dbo.name,
            searchKey: dbo.searchKey,
            updateDate: dbo.updateDate,
        });
    }

    static toDbo(entity: AssociationSearchEntity): WithoutId<AssociationSearchDbo> {
        return {
            siren: entity.siren.value,
            rna: entity.rna ? entity.rna.value : null,
            name: entity.name,
            searchKey: entity.searchKey,
            updateDate: entity.updateDate,
        };
    }
}
