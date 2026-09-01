import { stringToDateOrNull } from "../../../../../shared/helpers/DateHelper";
import RnaDbo from "../../../../outputs/db/rna/rna.dbo";
import { RnaWaldecDto } from "./rna.dto";

export class RnaMapper {
    map(dto: RnaWaldecDto): RnaDbo {
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
}
const rnaMapper = new RnaMapper();
export default rnaMapper;
