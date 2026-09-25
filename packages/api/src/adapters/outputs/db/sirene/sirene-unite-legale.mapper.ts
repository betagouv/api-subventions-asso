import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import { Rna, Siren } from "../../../../identifier-objects";
import { SireneUniteLegaleDbo } from "./SireneUniteLegaleDbo";

export default class SireneUniteLegaleMapper {
    static toEntity(raw: SireneUniteLegaleDbo): SireneUniteLegaleEntity {
        return {
            ...raw,
            identifiantAssociationUniteLegale: raw.identifiantAssociationUniteLegale
                ? new Rna(raw.identifiantAssociationUniteLegale)
                : null,
            siren: new Siren(raw.siren),
        };
    }
}
