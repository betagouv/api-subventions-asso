import { AssociationNameDto } from "dto";
import AssociationNameEntity from "../../association-name/entities/AssociationNameEntity";

export default class AssociationNameDtoMapper {
    static toDto(entity: AssociationNameEntity): AssociationNameDto {
        return {
            siren: entity.siren.value,
            name: entity.name,
            rna: entity.rna ? entity.rna.value : undefined,
            address: entity.address,
            nbEtabs: entity.nbEtabs,
        };
    }
}
