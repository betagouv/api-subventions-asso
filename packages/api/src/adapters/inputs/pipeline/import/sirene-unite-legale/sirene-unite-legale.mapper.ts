import AssociationSearchDbo from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { SireneUniteLegaleDbo } from "../../../../outputs/db/sirene/SireneUniteLegaleDbo";

export default class SireneUniteLegaleMapper {
    static toDbo(dto): SireneUniteLegaleDbo {
        return { ...dto, categorieJuridiqueUniteLegale: String(dto.categorieJuridiqueUniteLegale) };
    }

    static toAssociationSearch(dbo: SireneUniteLegaleDbo) {
        return {
            siren: dbo.siren,
            rna: dbo.identifiantAssociationUniteLegale,
            mainEstablishmentSiret: dbo.siren + dbo.nicSiegeUniteLegale,
        } as Pick<AssociationSearchDbo, "siren" | "rna" | "mainEstablishmentSiret">;
    }
}
