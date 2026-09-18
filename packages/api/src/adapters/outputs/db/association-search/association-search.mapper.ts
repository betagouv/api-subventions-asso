import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Siren from "../../../../identifier-objects/Siren";
import AssociationSearchDbo from "./@types/AssociationSearchDbo";
import Rna from "../../../../identifier-objects/Rna";
import { Siret } from "../../../../identifier-objects";

export default class AssociationSearchMapper {
    static toEntity(dbo: AssociationSearchDbo): AssociationSearchEntity {
        return new AssociationSearchEntity({
            ...dbo,
            siren: new Siren(dbo.siren),
            mainEstablishmentSiret: new Siret(dbo.mainEstablishmentSiret),
            rna: dbo.rna ? new Rna(dbo.rna) : undefined,
            address: dbo.address ?? undefined,
            nbEstabs: dbo.nbEstabs ?? undefined,
        });
    }

    static toDbo(entity: AssociationSearchEntity): AssociationSearchDbo {
        return {
            ...entity,
            siren: entity.siren.value,
            mainEstablishmentSiret: entity.mainEstablishmentSiret.value,
            rna: entity.rna ? entity.rna.value : null,
        };
    }
}
