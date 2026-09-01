/**
 * RnaWaldec is used instead of simply Rna because it would collide with the RnaDto from 'dto' package
 * Waldec is one of the two files available on the RNA data.gouv page.
 * (Waldec is the W from the RNA format)
 *
 * All fields are made nullable as we do not trust providers
 * Only id, which is the RNA identifier, is trusted to be defined
 */
export interface RnaWaldecDto {
    id: string;
    id_ex: string | null;
    siret: string | null;
    rup_mi: string | null;
    gestion: string | null;
    date_creat: string | null;
    date_decla: string | null;
    date_publi: string | null;
    date_disso: string | null;
    nature: string | null;
    groupement: string | null;
    titre: string | null;
    titre_court: string | null;
    objet: string | null;
    objet_social1: string | null;
    objet_social2: string | null;
    adrs_complement: string | null;
    adrs_numvoie: string | null;
    adrs_repetition: string | null;
    adrs_typevoie: string | null;
    adrs_libvoie: string | null;
    adrs_distrib: string | null;
    adrs_codeinsee: string | null;
    adrs_codepostal: string | null;
    adrs_libcommune: string | null;
    adrg_declarant: string | null;
    adrg_complemid: string | null;
    adrg_complemgeo: string | null;
    adrg_libvoie: string | null;
    adrg_distrib: string | null;
    adrg_codepostal: string | null;
    adrg_achemine: string | null;
    adrg_pays: string | null;
    dir_civilite: string | null;
    siteweb: string | null;
    publiweb: string | null;
    observation: string | null;
    position: string | null;
    maj_time: string;
}
