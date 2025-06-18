import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";
import Rna from "../../../identifierObjects/Rna";
import AssociationNameEntity from "../entities/AssociationNameEntity";

export default class AssociationNameAdapter {
    static fromUniteLegalNameEntity(uniteLegalNameEntity: UniteLegalNameEntity, rna?: Rna): AssociationNameEntity {
        return new AssociationNameEntity(uniteLegalNameEntity.name, uniteLegalNameEntity.siren, rna);
    }
}
