import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import AssociationSearchDbo from "./@types/AssociationSearchDbo";

export default class AssociationSearchMapper {
    static toEntity(dbo: AssociationSearchDbo): AssociationSearchEntity {
        const { siren, rna, mainEstablishmentSiret, name, object, address, nbEstabs, ..._rest } = dbo;

        const props = {
            siren,
            mainEstablishmentSiret,
            name,
            rna: rna,
            object: object ?? undefined,
            address: address ?? undefined,
            nbEstabs: nbEstabs ?? undefined,
        };

        return new AssociationSearchEntity(props);
    }
}
