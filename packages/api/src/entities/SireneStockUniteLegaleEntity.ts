import SireneUniteLegaleDto from "../modules/providers/sirene/stockUniteLegale/@types/SireneUniteLegaleDto";
import Siren from "../identifierObjects/Siren";

export type SireneStockUniteLegaleEntity = Omit<SireneUniteLegaleDto, "siren"> & { siren: Siren };
