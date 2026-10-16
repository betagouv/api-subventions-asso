import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import { Rna, Siren } from "../../../../identifier-objects";
import { SireneUniteLegaleDbo } from "./SireneUniteLegaleDbo";

export default class SireneUniteLegaleMapper {
    static toEntity(raw: SireneUniteLegaleDbo): SireneUniteLegaleEntity {
        return {
            ...raw,
            identifiantAssociationUniteLegale: Rna.isRna(raw.identifiantAssociationUniteLegale)
                ? new Rna(raw.identifiantAssociationUniteLegale as string)
                : null, // treat wrong RNA as null in the system
            siren: new Siren(raw.siren),
        };
    }
}
