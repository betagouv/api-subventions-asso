import AssociationSearchEntity from "../../../entities/AssociationSearchEntity";
import Rna from "../../../identifier-objects/Rna";
import AssociationNameEntity from "../entities/AssociationNameEntity";

export default class AssociationNameMapper {
    static fromUniteLegaleNameEntity(
        AssociationSearchEntity: AssociationSearchEntity,
        rna?: Rna,
    ): AssociationNameEntity {
        return new AssociationNameEntity(AssociationSearchEntity.name, AssociationSearchEntity.siren, rna);
    }
}
