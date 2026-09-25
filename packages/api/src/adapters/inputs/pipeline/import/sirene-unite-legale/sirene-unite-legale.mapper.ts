import AssociationSearchDbo from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { SireneUniteLegaleDbo } from "../../../../outputs/db/sirene/SireneUniteLegaleDbo";
import SireneUniteLegaleDto from "./SireneUniteLegaleDto";

export default class SireneUniteLegaleMapper {
    static toDbo(dto: SireneUniteLegaleDto): SireneUniteLegaleDbo {
        return {
            ...dto,
            anneeEffectifsUniteLegale: Number(dto.anneeEffectifsUniteLegale),
            nombrePeriodesUniteLegale: Number(dto.nombrePeriodesUniteLegale),
            anneeCategorieEntreprise: Number(dto.anneeCategorieEntreprise),
            categorieJuridiqueUniteLegale: String(dto.categorieJuridiqueUniteLegale),
        };
    }

    static toAssociationSearch(dbo: SireneUniteLegaleDbo) {
        return {
            siren: dbo.siren,
            rna: dbo.identifiantAssociationUniteLegale ?? undefined,
            mainEstablishmentSiret: dbo.siren + dbo.nicSiegeUniteLegale,
        } as Pick<AssociationSearchDbo, "siren" | "rna" | "mainEstablishmentSiret">;
    }
}
