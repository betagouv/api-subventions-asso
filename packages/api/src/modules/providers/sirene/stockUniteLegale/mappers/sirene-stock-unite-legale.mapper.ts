import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { SireneStockUniteLegaleEntity } from "../../../../../entities/SireneStockUniteLegaleEntity";
import { SireneUniteLegaleDbo } from "../@types/SireneUniteLegaleDbo";
import Siren from "../../../../../identifierObjects/Siren";
import UniteLegalNameEntity from "../../../../../entities/UniteLegalNameEntity";
import UniteLegalNameMapper from "../../../../../dataProviders/db/uniteLegalName/unite-legal-name.mapper";

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

    static entityToUniteLegaleNameEntity(entity: SireneStockUniteLegaleEntity): UniteLegalNameEntity {
        return new UniteLegalNameEntity(
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
