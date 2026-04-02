import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { SireneStockUniteLegaleEntity } from "../../../../../entities/SireneStockUniteLegaleEntity";
import { SireneUniteLegaleDbo } from "../@types/SireneUniteLegaleDbo";
import Siren from "../../../../../identifierObjects/Siren";
import UniteLegaleNameEntity from "../../../../../entities/UniteLegaleNameEntity";
import UniteLegalNameMapper from "../../../../../adapters/outputs/db/unite-legale-name/unite-legale-name.mapper";

export default class SireneStockUniteLegaleMapper {
    static dtoToEntity(dto: SireneUniteLegaleDto): SireneStockUniteLegaleEntity {
        return {
            ...dto,
            siren: new Siren(dto.siren),
        };
    }

    static entityToDbo(entity: SireneStockUniteLegaleEntity): SireneUniteLegaleDbo {
        return {
            ...entity,
            siren: entity.siren.value,
        };
    }

    static entityToUniteLegaleNameEntity(entity: SireneStockUniteLegaleEntity): UniteLegaleNameEntity {
        return new UniteLegaleNameEntity(
            entity.siren,
            entity.denominationUniteLegale,
            UniteLegalNameMapper.buildSearchKey(entity.siren, entity.denominationUniteLegale),
            new Date(entity.dateDebut),
        );
    }

    static dboToEntity(dbo: SireneUniteLegaleDbo) {
        return {
            ...dbo,
            siren: new Siren(dbo.siren),
        };
    }
}
