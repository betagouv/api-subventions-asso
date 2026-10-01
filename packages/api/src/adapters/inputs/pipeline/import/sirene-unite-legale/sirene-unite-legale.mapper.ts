import { removeAccents } from "../../../../../shared/helpers/StringHelper";
import { UniteLegaleAssociationSearch } from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
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
        const rna = dbo.identifiantAssociationUniteLegale;

        const associationSearch: UniteLegaleAssociationSearch = {
            siren: dbo.siren,
            name: {
                sirene: dbo.denominationUniteLegale,
            },
            searchName: removeAccents(dbo.denominationUniteLegale),
            mainEstablishmentSiret: dbo.siren + dbo.nicSiegeUniteLegale,
        };

        if (rna) associationSearch.rna = rna;
        return associationSearch;
    }
}
