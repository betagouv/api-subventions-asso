import { Rna } from "../../../../../identifier-objects";
import AssociationSearchDbo from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { SireneUniteLegaleDbo } from "../../../../outputs/db/sirene/SireneUniteLegaleDbo";
import SireneUniteLegaleDto from "./SireneUniteLegaleDto";

export default class SireneUniteLegaleMapper {
    static toDbo(dto: SireneUniteLegaleDto): SireneUniteLegaleDbo {
        return {
            ...dto,
            anneeEffectifsUniteLegale: !dto.anneeEffectifsUniteLegale ? null : Number(dto.anneeEffectifsUniteLegale),
            nombrePeriodesUniteLegale: !dto.nombrePeriodesUniteLegale ? null : Number(dto.nombrePeriodesUniteLegale),
            anneeCategorieEntreprise: !dto.anneeCategorieEntreprise ? null : Number(dto.anneeCategorieEntreprise),
            categorieJuridiqueUniteLegale: String(dto.categorieJuridiqueUniteLegale),
        };
    }

    static toAssociationSearch(dbo: SireneUniteLegaleDbo) {
        return {
            siren: dbo.siren,
            rna: Rna.isRna(dbo.identifiantAssociationUniteLegale) ? dbo.identifiantAssociationUniteLegale : undefined,
            mainEstablishmentSiret: dbo.siren + dbo.nicSiegeUniteLegale,
        } as Pick<AssociationSearchDbo, "siren" | "rna" | "mainEstablishmentSiret">;
    }
}
