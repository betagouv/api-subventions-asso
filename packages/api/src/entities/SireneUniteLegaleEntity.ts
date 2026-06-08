import SireneUniteLegaleDto from "../modules/providers/sirene/@types/SireneUniteLegaleDto";
import Siren from "../identifier-objects/Siren";

export type SireneUniteLegaleEntity = Omit<SireneUniteLegaleDto, "siren"> & { siren: Siren };
