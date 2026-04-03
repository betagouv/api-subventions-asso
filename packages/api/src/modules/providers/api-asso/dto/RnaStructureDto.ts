export interface RnaStructureDto {
    identite: {
        nom: string;
        sigle: string;
        id_rna: string;
        date_pub_jo: string;
        date_modif_rna: string;
        active: boolean;
        nature: string;
        util_publique: boolean;
        date_publication_util_publique: string;
    };
    activites: {
        objet: string;
        lib_objet_social1: string;
        annee_activite_principale: number;
        effectif_salarie_cent: number;
        annee_effectif_salarie_cent: number;
    };
    coordonnees: {
        adresse_siege: {
            cplt_1: string;
            num_voie: number;
            voie: string;
            commune: string;
            cp: number;
            bp?: string;
            type_voie: string;
        };
        adresse_gestion: {
            cplt_1: string;
            voie: string;
            commune: string;
            cp: number;
            pays: string;
        };
    };
}
