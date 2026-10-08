import { Rna } from "../../../../../identifier-objects";
import { SanitizeSearchText } from "../../../../../usecases/search/sanitize-search-text";
import { SplitTextInTokens } from "../../../../../usecases/search/split-text-in-tokens";
import { UniteLegaleAssociationSearch } from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import { SireneUniteLegaleDbo } from "../../../../outputs/db/sirene/SireneUniteLegaleDbo";
import SireneUniteLegaleDto from "./SireneUniteLegaleDto";

export class SireneUniteLegaleMapper {
    constructor(
        private sanitize: SanitizeSearchText,
        private split: SplitTextInTokens,
    ) {}

    toDbo(dto: SireneUniteLegaleDto): SireneUniteLegaleDbo {
        return {
            ...dto,
            anneeEffectifsUniteLegale: !dto.anneeEffectifsUniteLegale ? null : Number(dto.anneeEffectifsUniteLegale),
            nombrePeriodesUniteLegale: !dto.nombrePeriodesUniteLegale ? null : Number(dto.nombrePeriodesUniteLegale),
            anneeCategorieEntreprise: !dto.anneeCategorieEntreprise ? null : Number(dto.anneeCategorieEntreprise),
            categorieJuridiqueUniteLegale: String(dto.categorieJuridiqueUniteLegale),
        };
    }

    private getRna(value: string | null) {
        if (!value) return null;
        else if (Rna.isRna(value)) return value;
        else return null;
    }
    SireneUniteLegaleMapper;

    toAssociationSearch(dbo: SireneUniteLegaleDbo) {
        const rna = this.getRna(dbo.identifiantAssociationUniteLegale);

        const associationSearch: UniteLegaleAssociationSearch = {
            siren: dbo.siren,
            name: {
                sirene: dbo.denominationUniteLegale,
            },
            searchName: this.sanitize.execute(dbo.denominationUniteLegale),
            nameTokens: this.split.execute(dbo.denominationUniteLegale),
            mainEstablishmentSiret: dbo.siren + dbo.nicSiegeUniteLegale,
        };

        if (rna) associationSearch.rna = rna;
        return associationSearch;
    }
}

const sireneUniteLegaleMapper = new SireneUniteLegaleMapper(new SanitizeSearchText(), new SplitTextInTokens());
export default sireneUniteLegaleMapper;
