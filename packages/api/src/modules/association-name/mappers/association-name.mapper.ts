import UniteLegaleNameEntity from "../../../entities/UniteLegaleNameEntity";
import Rna from "../../../identifier-objects/Rna";
import AssociationNameEntity from "../entities/AssociationNameEntity";

export default class AssociationNameMapper {
    static fromUniteLegaleNameEntity(UniteLegaleNameEntity: UniteLegaleNameEntity, rna?: Rna): AssociationNameEntity {
        return new AssociationNameEntity(UniteLegaleNameEntity.name, UniteLegaleNameEntity.siren, rna);
    }
}
