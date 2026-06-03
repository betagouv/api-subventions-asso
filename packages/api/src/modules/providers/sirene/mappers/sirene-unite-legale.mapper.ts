import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import { SireneUniteLegaleDbo } from "../@types/SireneUniteLegaleDbo";
import Siren from "../../../../identifier-objects/Siren";
import UniteLegaleNameEntity from "../../../../entities/UniteLegaleNameEntity";
import UniteLegalNameMapper from "../../../../adapters/outputs/db/unite-legale-name/unite-legale-name.mapper";

export default class SireneUniteLegaleMapper {
    static dtoToEntity(dto: SireneUniteLegaleDto): SireneUniteLegaleEntity {
        return {
            ...dto,
            siren: new Siren(dto.siren),
        };
    }

    static entityToDbo(entity: SireneUniteLegaleEntity): SireneUniteLegaleDbo {
        return {
            ...entity,
            siren: entity.siren.value,
        };
    }

    static entityToUniteLegaleNameEntity(entity: SireneUniteLegaleEntity): UniteLegaleNameEntity {
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
        } as SireneUniteLegaleEntity;
    }
}
