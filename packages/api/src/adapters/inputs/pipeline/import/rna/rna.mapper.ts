import { Siren, Siret } from "../../../../../identifier-objects";
import { stringToDateOrNull } from "../../../../../shared/helpers/DateHelper";
import { SanitizeSearchText } from "../../../../../usecases/search/sanitize-search-text";
import { SplitTextInTokens } from "../../../../../usecases/search/split-text-in-tokens";
import { RnaAssociationSearch } from "../../../../outputs/db/association-search/@types/AssociationSearchDbo";
import RnaDbo from "../../../../outputs/db/rna/rna.dbo";
import { RnaWaldecDto } from "./rna.dto";

export class RnaMapper {
    constructor(
        private sanitize: SanitizeSearchText,
        private split: SplitTextInTokens,
    ) {}

    toDbo(dto: RnaWaldecDto): RnaDbo {
        return {
            id: dto.id,
            "id-ex": dto.id_ex,
            siret: dto.siret,
            "rup-mi": dto.rup_mi,
            gestion: dto.gestion,
            "date-creat": stringToDateOrNull(dto.date_creat),
            "date-decla": stringToDateOrNull(dto.date_decla),
            "date-publi": stringToDateOrNull(dto.date_publi),
            "date-disso": stringToDateOrNull(dto.date_disso),
            nature: dto.nature,
            groupement: dto.groupement,
            titre: dto.titre,
            "titre-court": dto.titre_court,
            objet: dto.objet,
            "objet-social1": dto.objet_social1,
            "objet-social2": dto.objet_social2,
            "adrs-complement": dto.adrs_complement,
            "adrs-numvoie": dto.adrs_numvoie,
            "adrs-repetition": dto.adrs_repetition,
            "adrs-typevoie": dto.adrs_typevoie,
            "adrs-libvoie": dto.adrs_libvoie,
            "adrs-distrib": dto.adrs_distrib,
            "adrs-codeinsee": dto.adrs_codeinsee,
            "adrs-codepostal": dto.adrs_codepostal,
            "adrs-libcommune": dto.adrs_libcommune,
            "adrg-declarant": dto.adrg_declarant,
            "adrg-complemid": dto.adrg_complemid,
            "adrg-complemgeo": dto.adrg_complemgeo,
            "adrg-libvoie": dto.adrg_libvoie,
            "adrg-distrib": dto.adrg_distrib,
            "adrg-codepostal": dto.adrg_codepostal,
            "adrg-achemine": dto.adrg_achemine,
            "adrg-pays": dto.adrg_pays,
            "dir-civilite": dto.dir_civilite,
            siteweb: dto.siteweb,
            publiweb: dto.publiweb,
            observation: dto.observation,
            position: dto.position,
            "maj-time": new Date(dto.maj_time),
        };
    }

    private getSiren(str: string | null) {
        if (!str) return null;
        // weird case that concerns 11 documents
        if (str === "000000000") return null;
        if (Siret.isSiret(str)) return Siret.getSiren(str);
        else if (Siren.isSiren(str)) return str;
        else return null;
    }

    toAssociationSearch(dbo: Omit<RnaDbo, "titre"> & { titre: string }): RnaAssociationSearch {
        const searchName = this.sanitize.execute(dbo.titre);
        const nameTokens = this.split.execute(searchName);
        const object = dbo.objet;
        const searchObject = dbo.objet ? this.sanitize.execute(dbo.objet) : undefined;
        const objectTokens = searchObject ? this.split.execute(searchObject) : undefined;
        const siren = this.getSiren(dbo.siret);

        const associationSearch: RnaAssociationSearch = {
            rna: dbo.id,
            name: {
                rna: dbo.titre,
            },
            searchName,
            nameTokens,
        };

        if (siren) associationSearch.siren = siren;
        if (object) associationSearch.object = object;
        if (searchObject) associationSearch.searchObject = searchObject;
        if (objectTokens) associationSearch.objectTokens = objectTokens;
        return associationSearch;
    }
}
const rnaMapper = new RnaMapper(new SanitizeSearchText(), new SplitTextInTokens());
export default rnaMapper;
