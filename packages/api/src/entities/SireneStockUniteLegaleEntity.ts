import SireneUniteLegaleDto from "../modules/providers/sirene/stockUniteLegale/@types/SireneUniteLegaleDto";
import Siren from "../identifier-objects/Siren";

export type SireneStockUniteLegaleEntity = Omit<SireneUniteLegaleDto, "siren"> & { siren: Siren };
