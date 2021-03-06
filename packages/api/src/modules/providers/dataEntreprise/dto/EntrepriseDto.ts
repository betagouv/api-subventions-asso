import EtablisementDto from "./EtablissementDto";

export default interface EntrepriseDto {
    unite_legale: {
        id: number,
        siren:  string,
        statut_diffusion: string,
        unite_purgee?: string,
        date_creation: string,
        sigle?: string,
        sexe?: string,
        prenom_1?: string,
        prenom_2?: string,
        prenom_3?: string,
        prenom_4?: string,
        prenom_usuel?: string,
        pseudonyme?: string,
        identifiant_association: string,
        tranche_effectifs: string,
        annee_effectifs: string,
        date_dernier_traitement: string,
        nombre_periodes: string,
        categorie_entreprise: string,
        annee_categorie_entreprise: string,
        date_fin?: string,
        date_debut: string,
        etat_administratif: string,
        nom?: string,
        nom_usage?: string,
        denomination: string,
        denomination_usuelle_1?: string,
        denomination_usuelle_2?: string,
        denomination_usuelle_3?: string,
        categorie_juridique: string,
        activite_principale: string,
        nomenclature_activite_principale: string,
        nic_siege: string,
        economie_sociale_solidaire: string,
        caractere_employeur: string,
        created_at: string,
        updated_at: string,
        etablissement_siege?: {
            id: number,
            siren: string,
            nic: string,
            siret: string,
            statut_diffusion: string,
            date_creation: string,
            tranche_effectifs: string,
            annee_effectifs: string,
            activite_principale_registre_metiers?: string,
            date_dernier_traitement: string,
            etablissement_siege: string,
            nombre_periodes: string,
            complement_adresse: string,
            numero_voie: string,
            indice_repetition?: string,
            type_voie: string,
            libelle_voie: string,
            code_postal: string,
            libelle_commune: string,
            libelle_commune_etranger?: string,
            distribution_speciale?: string,
            code_commune: string,
            code_cedex?: string,
            libelle_cedex?: string,
            code_pays_etranger?: string,
            libelle_pays_etranger?: string,
            complement_adresse_2?: string,
            numero_voie_2?: string,
            indice_repetition_2?: string,
            type_voie_2?: string,
            libelle_voie_2?: string,
            code_postal_2?: string,
            libelle_commune_2?: string,
            libelle_commune_etranger_2?: string,
            distribution_speciale_2?: string,
            code_commune_2?: string,
            code_cedex_2?: string,
            libelle_cedex_2?: string,
            code_pays_etranger_2?: string,
            libelle_pays_etranger_2?: string,
            date_debut: string,
            etat_administratif: string,
            enseigne_1?: string,
            enseigne_2?: string,
            enseigne_3?: string,
            denomination_usuelle?: string,
            activite_principale: string,
            nomenclature_activite_principale: string,
            caractere_employeur: string,
            longitude: string,
            latitude: string,
            geo_score: string,
            geo_type: string,
            geo_adresse: string,
            geo_id: string,
            geo_ligne: string,
            geo_l4: string,
            geo_l5?: string,
            unite_legale_id: number,
            created_at: string,
            updated_at: string
        },
        numero_tva_intra: string,
        etablissements?: EtablisementDto[]
    }
}