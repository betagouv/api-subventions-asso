import AssociationSearchEntity, { AssociationSearchProps } from "../../../../entities/AssociationSearchEntity";
import AssociationSearchDbo from "./@types/AssociationSearchDbo";

export default class AssociationSearchMapper {
    static toEntity(dbo: AssociationSearchDbo): AssociationSearchEntity {
        const { siren, rna, mainEstablishmentSiret, name, object, address, nbEstabs, ..._rest } = dbo;

        const props: Partial<AssociationSearchProps> = {};

        if (siren) props.siren = siren;
        if (mainEstablishmentSiret) props.mainEstablishmentSiret = mainEstablishmentSiret;
        if (rna) props.rna = rna;
        if (name) props.name = name;
        if (object) props.object = object;
        if (address) props.address = address;
        if (nbEstabs) props.nbEstabs = nbEstabs;

        return new AssociationSearchEntity(props as AssociationSearchProps);
    }
}
