import SireneUniteLegaleDto from "../modules/providers/sirene/stockUniteLegale/@types/SireneUniteLegaleDto";
import Siren from "../valueObjects/Siren";

export type SireneStockUniteLegaleEntity = Omit<SireneUniteLegaleDto, "siren"> & { siren: Siren };
