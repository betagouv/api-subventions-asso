import AssociationSearchEntity from "../../entities/AssociationSearchEntity";
import { SireneUniteLegaleEntity } from "../../entities/SireneUniteLegaleEntity";

export default class UniteLegaleToSearch {
    execute(entity: SireneUniteLegaleEntity): AssociationSearchEntity {
        return new AssociationSearchEntity({
            siren: entity.siren,
            rna: entity.identifiantAssociationUniteLegale ?? undefined,
            name: entity.denominationUniteLegale ?? "",
        });
    }
}
