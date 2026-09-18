import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import { Rna, Siren } from "../../../../identifier-objects";
import { SireneUniteLegaleDbo } from "./SireneUniteLegaleDbo";

export default class SireneUniteLegaleMapper {
    static toEntity(raw: SireneUniteLegaleDbo): SireneUniteLegaleEntity {
        return {
            ...raw,
            identifiantAssociationUniteLegale: Rna.isRna(raw.identifiantAssociationUniteLegale)
                ? new Rna(raw.identifiantAssociationUniteLegale as string)
                : null,
            siren: new Siren(raw.siren),
        };
    }

    static entityToDbo(entity: SireneUniteLegaleEntity): SireneUniteLegaleDbo {
        return {
            ...entity,
            identifiantAssociationUniteLegale:
                entity.identifiantAssociationUniteLegale instanceof Rna
                    ? entity.identifiantAssociationUniteLegale.value
                    : "",
            siren: entity.siren.value,
        };
    }
}
