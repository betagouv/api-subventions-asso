import { ObjectId } from "mongodb";

import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { SireneStockUniteLegaleEntity } from "../../../../../entities/SireneStockUniteLegaleEntity";
import { SireneUniteLegaleDbo } from "../@types/SireneUniteLegaleDbo";
import Siren from "../../../../../valueObjects/Siren";
import UniteLegalNameEntity from "../../../../../entities/UniteLegalNameEntity";
import UniteLegalNameAdapter from "../../../../../dataProviders/db/uniteLegalName/UniteLegalName.adapter";

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

    static entityToUniteLegaleNameEntity(entity: SireneStockUniteLegaleEntity): UniteLegalNameEntity {
        return new UniteLegalNameEntity(
            entity.siren,
            entity.denominationUniteLegale,
            UniteLegalNameAdapter.buildSearchKey(entity.siren, entity.denominationUniteLegale),
            new Date(entity.dateDebut),
        );
    }
}
