import { ObjectId } from "mongodb";
import { SireneStockUniteLegaleEntity } from "../../../../../entities/SireneStockUniteLegaleEntity";

export type SireneUniteLegaleDbo = SireneStockUniteLegaleEntity & {_id : ObjectId};