import AssociationSearchEntity from "../../../../../entities/AssociationSearchEntity";
import { SireneUniteLegaleEntity } from "../../../../../entities/SireneUniteLegaleEntity";
import { Rna, Siren } from "../../../../../identifier-objects";
import { ParquetRow } from "../../../parquet.parser";
import SireneUniteLegaleDto from "./SireneUniteLegaleDto";

export default class SireneUniteLegaleMapper {
    static parquetRowToEntity(row: ParquetRow): SireneUniteLegaleEntity {
        return this.toEntity(row as unknown as SireneUniteLegaleDto);
    }

    static toEntity(dto: SireneUniteLegaleDto): SireneUniteLegaleEntity {
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
            identifiantAssociationUniteLegale: new Rna(dto.identifiantAssociationUniteLegale),
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

    static toAssociationSearch(entity: SireneUniteLegaleEntity) {
        return {
            siren: entity.siren,
            rna: entity.identifiantAssociationUniteLegale ?? undefined,
            mainEstablishmentSiret: entity.siren.toSiret(entity.nicSiegeUniteLegale),
        } as Pick<AssociationSearchEntity, "siren" | "rna" | "mainEstablishmentSiret">;
    }
}
