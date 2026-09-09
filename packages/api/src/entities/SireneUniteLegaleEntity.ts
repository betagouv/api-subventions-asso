import Siren from "../identifier-objects/Siren";
import { Rna } from "../identifier-objects";

export type SireneUniteLegaleEntity = Omit<SireneUniteLegaleDto, "siren" | "identifiantAssociationUniteLegale"> & {
    siren: Siren;
    identifiantAssociationUniteLegale: Rna | null;
};
