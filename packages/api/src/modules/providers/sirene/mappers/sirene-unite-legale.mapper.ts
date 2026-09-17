import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import { SireneUniteLegaleDbo } from "../@types/SireneUniteLegaleDbo";
import Siren from "../../../../identifier-objects/Siren";
import UniteLegaleNameEntity from "../../../../entities/UniteLegaleNameEntity";
import UniteLegalNameMapper from "../../../../adapters/outputs/db/unite-legale-name/unite-legale-name.mapper";
import { ParquetRow } from "../../../../adapters/inputs/parquet.parser";

export default class SireneUniteLegaleMapper {
    static parquetRowToEntity(row: ParquetRow): SireneUniteLegaleEntity {
        return this.dtoToEntity(row as unknown as SireneUniteLegaleDto);
    }

    static dtoToEntity(dto: SireneUniteLegaleDto): SireneUniteLegaleEntity {
        return {
            siren: new Siren(dto.siren),
            statutDiffusionUniteLegale: dto.statutDiffusionUniteLegale,
            unitePurgeeUniteLegale: dto.unitePurgeeUniteLegale,
            dateCreationUniteLegale: dto.dateCreationUniteLegale,
            sigleUniteLegale: dto.sigleUniteLegale,
            sexeUniteLegale: dto.sexeUniteLegale,
            prenom1UniteLegale: dto.prenom1UniteLegale,
            prenom2UniteLegale: dto.prenom2UniteLegale,
            prenom3UniteLegale: dto.prenom3UniteLegale,
            prenom4UniteLegale: dto.prenom4UniteLegale,
            prenomUsuelUniteLegale: dto.prenomUsuelUniteLegale,
            pseudonymeUniteLegale: dto.pseudonymeUniteLegale,
            identifiantAssociationUniteLegale: dto.identifiantAssociationUniteLegale,
            trancheEffectifsUniteLegale: dto.trancheEffectifsUniteLegale,
            anneeEffectifsUniteLegale:
                dto.anneeEffectifsUniteLegale === null ? null : Number(dto.anneeEffectifsUniteLegale),
            dateDernierTraitementUniteLegale: dto.dateDernierTraitementUniteLegale,
            nombrePeriodesUniteLegale:
                dto.nombrePeriodesUniteLegale === null ? null : Number(dto.nombrePeriodesUniteLegale),
            categorieEntreprise: dto.categorieEntreprise,
            anneeCategorieEntreprise:
                dto.anneeCategorieEntreprise === null ? null : Number(dto.anneeCategorieEntreprise),
            dateDebut: dto.dateDebut,
            etatAdministratifUniteLegale: dto.etatAdministratifUniteLegale,
            nomUniteLegale: dto.nomUniteLegale,
            nomUsageUniteLegale: dto.nomUsageUniteLegale,
            denominationUniteLegale: dto.denominationUniteLegale,
            denominationUsuelle1UniteLegale: dto.denominationUsuelle1UniteLegale,
            denominationUsuelle2UniteLegale: dto.denominationUsuelle2UniteLegale,
            denominationUsuelle3UniteLegale: dto.denominationUsuelle3UniteLegale,
            categorieJuridiqueUniteLegale:
                dto.categorieJuridiqueUniteLegale === null ? null : String(dto.categorieJuridiqueUniteLegale),
            activitePrincipaleUniteLegale: dto.activitePrincipaleUniteLegale,
            nomenclatureActivitePrincipaleUniteLegale: dto.nomenclatureActivitePrincipaleUniteLegale,
            nicSiegeUniteLegale: dto.nicSiegeUniteLegale,
            economieSocialeSolidaireUniteLegale: dto.economieSocialeSolidaireUniteLegale,
            societeMissionUniteLegale: dto.societeMissionUniteLegale,
            caractereEmployeurUniteLegale: dto.caractereEmployeurUniteLegale,
            activitePrincipaleNAF25UniteLegale: dto.activitePrincipaleNAF25UniteLegale,
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
            entity.denominationUniteLegale as string,
            UniteLegalNameMapper.buildSearchKey(entity.siren, entity.denominationUniteLegale as string),
            entity.dateDebut as Date,
        );
    }

    static dboToEntity(dbo: SireneUniteLegaleDbo) {
        return {
            ...dbo,
            siren: new Siren(dbo.siren),
        } as SireneUniteLegaleEntity;
    }
}
