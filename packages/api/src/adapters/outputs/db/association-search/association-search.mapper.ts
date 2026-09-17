import { WithoutId } from "mongodb";
import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";
import AssociationSearchDbo from "./@types/AssociationSearchDbo";
import Rna from "../../../../identifier-objects/Rna";

export default class AssociationSearchMapper {
    static toEntity(dbo: AssociationSearchDbo): AssociationSearchEntity {
        return new AssociationSearchEntity({
            ...dbo,
            siren: new Siren(dbo.siren),
            rna: dbo.rna ? new Rna(dbo.rna) : undefined,
            address: dbo.address ?? undefined,
            nbEstabs: dbo.nbEstabs ?? undefined,
        });
    }

    static toDbo(entity: AssociationSearchEntity): WithoutId<AssociationSearchDbo> {
        return {
            ...entity,
            siren: entity.siren.value,
            rna: entity.rna ? entity.rna.value : null,
        };
    }
}
