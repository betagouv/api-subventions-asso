import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import { Rna, Siren } from "../../../../identifier-objects";
import { SireneUniteLegaleDbo } from "./SireneUniteLegaleDbo";

export default class SireneUniteLegaleMapper {
    static toEntity(raw: SireneUniteLegaleDbo): SireneUniteLegaleEntity {
        return {
            ...raw,
            identifiantAssociationUniteLegale: new Rna(raw.identifiantAssociationUniteLegale),
            siren: new Siren(raw.siren),
        };
    }
}
