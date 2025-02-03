import { ObjectId } from "mongodb";

import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { SireneStockUniteLegaleEntity } from "../../../../../entities/SireneStockUniteLegaleEntity";
import { SireneUniteLegaleDbo } from "../@types/SireneUniteLegaleDbo";
import Siren from "../../../../../valueObjects/Siren";

export default class SireneStockUniteLegaleAdapter {
    static dtoToEntity(dto: SireneUniteLegaleDto): SireneStockUniteLegaleEntity {
        return {
            ...dto,
            siren: new Siren(dto.siren),
        };
    }

    static entityToDbo(entity: SireneStockUniteLegaleEntity): SireneUniteLegaleDbo {
        return {
            ...entity,
            _id: new ObjectId(),
        };
    }
}
