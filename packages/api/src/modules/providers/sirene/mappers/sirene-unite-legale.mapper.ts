import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import { SireneUniteLegaleDbo } from "../@types/SireneUniteLegaleDbo";
import Siren from "../../../../identifier-objects/Siren";
import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import { Rna } from "../../../../identifier-objects";
import { ParquetRow } from "../../../../adapters/inputs/parquet.parser";

export default class SireneUniteLegaleMapper {
    static parquetRowToEntity(row: ParquetRow): SireneUniteLegaleEntity {
        return this.toEntity(row as unknown as SireneUniteLegaleDto);
    }

    static toEntity(raw: SireneUniteLegaleDto | SireneUniteLegaleDbo): SireneUniteLegaleEntity {
        return {
            ...raw,
            identifiantAssociationUniteLegale: Rna.isRna(raw.identifiantAssociationUniteLegale)
                ? new Rna(raw.identifiantAssociationUniteLegale as string)
                : null,
            siren: new Siren(raw.siren),
        };
    }

    static entityToDbo(entity: SireneUniteLegaleEntity): SireneUniteLegaleDbo {
        return {
            ...entity,
            identifiantAssociationUniteLegale:
                entity.identifiantAssociationUniteLegale instanceof Rna
                    ? entity.identifiantAssociationUniteLegale.value
                    : "",
            siren: entity.siren.value,
        };
    }

    static entityToAssociationSearchEntity(entity: SireneUniteLegaleEntity): AssociationSearchEntity {
        return new AssociationSearchEntity({
            siren: entity.siren,
            rna: entity.identifiantAssociationUniteLegale,
            name: entity.denominationUniteLegale,
        });
    }
}
