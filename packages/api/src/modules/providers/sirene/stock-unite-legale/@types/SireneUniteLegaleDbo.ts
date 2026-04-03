import { OptionalId } from "mongodb";
import { SireneStockUniteLegaleEntity } from "../../../../../entities/SireneStockUniteLegaleEntity";

export type SireneUniteLegaleDbo = Omit<OptionalId<SireneStockUniteLegaleEntity>, "siren"> & { siren: string };
