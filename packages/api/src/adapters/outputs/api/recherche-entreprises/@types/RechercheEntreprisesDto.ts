export interface RechercheEntreprisesDto {
    results?: RechercheEntreprisesResultDto[];
    total_results: number;
    /** @default 1 */
    page: number;
    /**
     * @description Nombre de résultats par page, limité à 25.
     * @default 10
     */
    per_page: number;
    /** @example 1000 */
    total_pages: number;
}

export interface RechercheEntreprisesResultDto {
    /**
     * @description le numéro unique de l'entreprise
     * @example 356000000
     */
    siren?: string;
    /**
     * @description Champs construit depuis les champs de dénomination : denomination de l'unité légale | Nom et prénom | Nom inconnu (dénomination usuelle : construite à partir des trois champs de dénomination usuelle de la base SIRENE) (sigle de l'unité légale).
     * @example la poste
     */
    nom_complet?: string;
    /**
     * @description La raison sociale pour les personnes morales (source : base SIRENE).
     * @example LA POSTE
     */
    nom_raison_sociale?: string;
    /**
     * @description Forme réduite de la raison sociale ou de la dénomination d'une personne morale ou d'un organisme public (source : base SIRENE).
     * @example null
     */
    sigle?: string | null;
    /**
     * Nombre des établissements de l'unité légale
     * @example 12734
     */
    nombre_etablissements?: number;
    /**
     * Nombre des établissements ouverts de l'unité légale
     * @example 9524
     */
    nombre_etablissements_ouverts?: number;
    siege?: {
        /**
         * @description Activité principale de l'établissement (source : base SIRENE).
         * @example 53.10Z
         */
        activite_principale?: string;
        /**
         * @description Activité principale de l'établissement au Registre des Métiers (source : base SIRENE).
         * @example null
         */
        activite_principale_registre_metier?: string | null;
        /**
         * @description Année de validité de la tranche d'effectif salarié de l'établissement (source : base SIRENE).
         * @example 2020
         */
        annee_tranche_effectif_salarie?: string | null;
        /**
         * @description Champs construit depuis les champs d'adresse de la base SIRENE : *complement adresse + numéro voie + indice repetition + type voie + libelle voie + distribution spéciale + (code postal + libelle commune | cedex + libelle cedex) + libelle commune étranger + libelle pays étranger*
         * @example DIRECTION GENERALE DE LA POSTE 9 RUE DU COLONEL PIERRE AVIA 75015 PARIS 15
         */
        adresse?: string;
        /**
         * @description Code cedex de l'établissement. Cette variable facultative est un élément constitutif de l'adresse. (source : base SIRENE).
         * @example null
         */
        cedex?: string | null;
        /**
         * @description Code pays de l'adresse d'un établissement situé à l'étranger (source : base SIRENE).
         * @example null
         */
        code_pays_etranger?: string | null;
        /**
         * @description Le code postal de l'adresse de l'établissement (source : base SIRENE).
         * @example 75015
         */
        code_postal?: string | null;
        /**
         * @description Le code géographique de la commune de localisation de l'établissement, hors adresse à l'étranger (source : base SIRENE).
         * @example 75115
         */
        commune?: string | null;
        /**
         * @description Le code géographique de la commune de localisation de l'établissement, hors adresse à l'étranger (source : base SIRENE).
         * @example DIRECTION GENERALE DE LA POSTE
         */
        complement_adresse?: string | null;
        /**
         * Format: date
         * @description Date de création de l'établissement (source : base SIRENE).
         * @example 2003-01-01
         */
        date_creation?: string | null;
        /**
         * Format: date
         * @description Date de début d'une période de l'historique d'un établissement (source : base SIRENE).
         * @example 2014-04-29
         */
        date_debut_activite?: string | null;
        /**
         * Format: date
         * @description Date du dernier traitement de l'établissement dans le répertoire Sirene (source : base SIRENE).
         * @example 2023-09-21T03:34:50
         */
        date_mise_a_jour?: string | null;
        /**
         * @description Code département de l'établissement (source : base SIRENE).
         * @example 75
         */
        departement?: string | null;
        /**
         * @description Distribution spéciale de l'établissement (source : base SIRENE).
         * @example null
         */
        distribution_speciale?: string | null;
        /**
         * @description L'établissement est le siège de l'unité légale.
         * @example true
         */
        est_siege?: boolean;
        /**
         * @description État administratif de l'établissement (A : Actif, F : Fermé) (source : base SIRENE).
         * @example A
         */
        etat_administratif?: string;
        /**
         * @description Identifiant géographique de l'adresse de l'établissement (source : base SIRENE géocodée par Etalab).
         * @example 75115_2214
         */
        geo_id?: string | null;
        /**
         * Format: string
         * @description Indice de répétition du numéro dans la voie (B pour Bis, T pour TER, lettres ou chiffres pour identifier différents bâtiments à une même adresse...) (source : base SIRENE).
         * @example null
         */
        indice_repetition?: unknown | null;
        /**
         * @description Latitude de l'établissement (source : base SIRENE géocodée par Etalab).
         * @example 48.83002
         */
        latitude?: string;
        /**
         * @description Libellé associé au code cedex (source : base SIRENE).
         * @example null
         */
        libelle_cedex?: string | null;
        /**
         * @description Libellé de la commune (source : base SIRENE).
         * @example PARIS 15
         */
        libelle_commune?: string;
        /**
         * @description Libellé de la commune pour un établissement situé à l'étranger (source : base SIRENE).
         * @example null
         */
        libelle_commune_etranger?: string | null;
        /**
         * @description Libellé du pays pour un établissement situé à l'étranger (source : base SIRENE).
         * @example null
         */
        libelle_pays_etranger?: string | null;
        /**
         * @description Libellé de la voie (source : base SIRENE).
         * @example DU COLONEL PIERRE AVIA
         */
        libelle_voie?: string;
        /**
         * @description Liste des enseignes de l'établissement (source : base SIRENE).
         * @example [
         *   "LA POSTE"
         * ]
         */
        liste_enseignes?: string[] | null;
        /**
         * @description Liste des identifiants FINESS de l'établissement (source : Ministère des Solidarités et de la Santé ).
         * @example [
         *   "950000364"
         * ]
         */
        liste_finess?: (string | null)[] | null;
        /**
         * @description Liste des conventions collectives de l'établissement (source : Ministère du travail).
         * @example [
         *   "0923"
         * ]
         */
        liste_idcc?: string[];
        /**
         * @description Liste des identifiants bio de l'établissement (source : Agence Bio).
         * @example [
         *   "0923"
         * ]
         */
        liste_id_bio?: string[];
        /**
         * @description Liste des identifiants RGE de l'établissement (source : ADEME).
         * @example [
         *   "4131D111",
         *   "7122D111"
         * ]
         */
        liste_rge?: string[];
        /**
         * @description Liste des identifiants UAI de l'établissements (source : Ministère de l'enseignement supérieur et de la recherche).
         * @example [
         *   "0170100S"
         * ]
         */
        liste_uai?: string[];
        /**
         * @description Longitude de l'établissement (source : base SIRENE géocodée par Etalab).
         * @example 2.275688
         */
        longitude?: string;
        /**
         * @description Dénomination usuelle de l'établissement (source : base SIRENE).
         * @example null
         */
        nom_commercial?: string | null;
        /**
         * @description Numéro dans la voie (source : base SIRENE).
         * @example 9
         */
        numero_voie?: string;
        /**
         * @description Code région de l'établissement (source : base SIRENE).
         * @example 11
         */
        region?: string | null;
        /**
         * @description le numéro unique de l'établissement siège.
         * @example 35600000000048
         */
        siret?: string;
        /**
         * @description Tranche d'effectif salarié de l'établissement (source : base SIRENE).
         * @example 41
         */
        tranche_effectif_salarie?: string;
        /**
         * @description Type de voie de l'adresse (source : base SIRENE).
         * @example RUE
         */
        type_voie?: string;
    };
    /**
     * Format: date
     * @description Date de création de l'unité légale (source : base SIRENE).
     * @example 1991-01-01
     */
    date_creation?: string;
    /**
     * @description Tranche d'effectif salarié de l'unité légale (source : base SIRENE).
     * @example 53
     */
    tranche_effectif_salarie?: string;
    /**
     * @description Année de validité de la tranche d'effectif salarié de l'unité légale (source : base SIRENE).
     * @example 2020
     */
    annee_tranche_effectif_salarie?: string;
    /**
     * Format: date
     * @description Date de la dernière modification d'une variable de niveau unité légale, qu'elle soit historisée ou non (source : base SIRENE).
     * @example 2022-05-31
     */
    date_mise_a_jour?: string;
    /**
     * @description Catégorie d'entreprise de l'unité légale (source : base SIRENE).
     * @example GE
     */
    categorie_entreprise?: string;
    /**
     * @description Année de validité correspondant à la catégorie d'entreprise diffusée (source : base SIRENE).
     * @example 2020
     */
    annee_categorie_entreprise?: string;
    /**
     * @description État administratif de l'unité légale (source : base SIRENE).
     * @example A
     */
    etat_administratif?: string;
    /**
     * @description Catégorie juridique de l'unité légale (source : base SIRENE).
     * @example 5510
     */
    nature_juridique?: string;
    /**
     * @description Code de l'activité principale exercée (APE) par l'unité légale (source : base SIRENE).
     * @example 53.10Z
     */
    activite_principale?: string;
    /**
     * @description Calculée à partir de l'activité principale.
     * @example H
     */
    section_activite_principale?: string;
    /**
     * @description Statut de diffusion de l'unité légale. Toutes les unités légales diffusibles ont le statut de diffusion à "O". Les unités légales ayant fait l'objet d'une demande d'opposition ont le statut de diffusion à "P" pour diffusion partielle (source : base SIRENE).
     * @example O
     */
    statut_diffusion?: string;
    matching_etablissements?: {
        /**
         * @description Activité principale de l'établissement (source : base SIRENE).
         * @example 53.10Z
         */
        activite_principale?: string;
        /**
         * @description Champs construit depuis les champs d'adresse de la base SIRENE : *complement adresse + numéro voie + indice repetition + type voie + libelle voie + distribution spéciale + (code postal + libelle commune | cedex + libelle cedex) + libelle commune étranger + libelle pays étranger*
         * @example 19 RUE DE LA POSTE 31700 CORNEBARRIEU
         */
        adresse?: string;
        /**
         * @description Le code géographique de la commune de localisation de l'établissement, hors adresse à l'étranger (source : base SIRENE).
         * @example 75115
         */
        commune?: string;
        /**
         * @description L'établissement est le siège de l'unité légale.
         * @example false
         */
        est_siege?: boolean;
        /**
         * @description État administratif de l'établissement (A : Actif, F : Fermé) (source : base SIRENE).
         * @example A
         */
        etat_administratif?: string;
        /**
         * @description Identifiant géographique de l'adresse de l'établissement (source : base SIRENE géocodée par Etalab).
         * @example 31150_0157_00019
         */
        geo_id?: string | null;
        /**
         * @description Latitude de l'établissement (source : base SIRENE géocodée par Etalab).
         * @example 48.83002
         */
        latitude?: string;
        /**
         * @description Libellé de la commune (source : base SIRENE).
         * @example PARIS 15
         */
        libelle_commune?: string;
        /**
         * @description Liste des enseignes de l'établissement (source : base SIRENE).
         * @example [
         *   "LA POSTE"
         * ]
         */
        liste_enseignes?: string[] | null;
        /**
         * @description Liste des identifiants FINESS de l'établissement (source : Ministère des Solidarités et de la Santé ).
         * @example [
         *   "950000364"
         * ]
         */
        liste_finess?: (string | null)[] | null;
        /**
         * @description Liste des conventions collectives de l'établissement (source : Ministère du travail).
         * @example [
         *   "0923"
         * ]
         */
        liste_idcc?: string[];
        /**
         * @description Liste des identifiants RGE de l'établissement (source : ADEME).
         * @example [
         *   "4131D111",
         *   "7122D111"
         * ]
         */
        liste_rge?: string[];
        /**
         * @description Liste des identifiants UAI de l'établissements (source : Ministère de l'enseignement supérieur et de la recherche).
         * @example [
         *   "0170100S"
         * ]
         */
        liste_uai?: string[];
        /**
         * @description Longitude de l'établissement (source : base SIRENE géocodée par Etalab).
         * @example 2.275688
         */
        longitude?: string;
        /**
         * @description Dénomination usuelle de l'établissement (source : base SIRENE).
         * @example null
         */
        nom_commercial?: string | null;
        /**
         * @description le numéro unique de l'établissement.
         * @example 35600000000048
         */
        siret?: string;
    }[];
    dirigeants?: (components["schemas"]["dirigeant_pp"] | components["schemas"]["dirigeant_pm"])[];
    finances?: components["schemas"]["finances"];
    complements?: {
        collectivite_territoriale?: components["schemas"]["collectivite_territoriale"];
        /** @description Indique si au moins un établissement a une convention collective renseignée */
        convention_collective_renseignee?: boolean;
        /** @description Indique si au moins un établissement a un indice égalité professionnel H/F renseigné */
        egapro_renseignee?: boolean;
        /**
         * @description Association (source: INSEE)
         * @example false
         */
        est_association?: boolean;
        /** @description Entreprise ayant au moins un établissement certifié bio (source: Agence Bio) */
        est_bio?: boolean;
        /**
         * @description Entreprise individuelle
         * @example false
         */
        est_entrepreneur_individuel?: boolean;
        /**
         * @description Entreprise ayant une licence d'entrepreneur du spectacle (source: Ministère de la Culture)
         * @example false
         */
        est_entrepreneur_spectacle?: boolean;
        /**
         * @description Entreprise d'économie sociale et solidaire (source: ESS France et INSEE)
         * @example false
         */
        est_ess?: boolean;
        /**
         * @description Entreprise ayant au moins un établissement FINESS (source : Ministère des Solidarités et de la Santé)
         * @example false
         */
        est_finess?: boolean;
        /** @description Entreprise ayant au moins un établissement organisme de formation (source: Ministère du Travail) */
        est_organisme_formation?: boolean;
        /** @description Entreprise ayant une certification de la marque « Qualiopi » (source: Ministère du Travail) */
        est_qualiopi?: boolean;
        /**
         * @description Liste des numéro de déclaration d’activité des établissement organismes de formation (source : Ministère du Travail).
         * @example [
         *   "7423P001123"
         * ]
         */
        liste_id_organisme_formation?: string[];
        /**
         * @description Entreprise ayant au moins un établissement RGE (source : ADEME)
         * @example false
         */
        est_rge?: boolean;
        /**
         * @description Uniquement les structures reconnues comme service public.
         * Attention : Ce filtre se base sur des règles de gestion documentées <a href=https://github.com/etalab/annuaire-entreprises-search-infra/blob/c4820119dfbf480979166540ee64278d33abb772/data_enrichment.py#L70>ici</a>.
         * Ce filtre n'est pas exhaustif et peut retourner des faux positifs.
         * @example false
         */
        est_service_public?: boolean;
        /**
         * @description Société qui appartient au champ des sociétés à mission.
         * @example false
         */
        est_societe_mission?: boolean;
        /**
         * @description Entreprise ayant au moins un établissement UAI (source : Ministère de l'enseignement supérieur et de la recherche)
         * @example false
         */
        est_uai?: boolean;
        /**
         * @description Numéro au Répertoire National des Associations (RNA) (source : base SIRENE).
         * @example null
         */
        identifiant_association?: string | null;
        /** @description Statut des établissements ayant fait une demande de certification bio (source: Agence Bio) */
        statut_bio?: boolean;
        /** @description Statut des établissements ayant fait une demande de licence d'entrepreneur du spectacle (source: Ministère de la Culture) */
        statut_entrepreneur_spectacle?: boolean;
    };
}

export interface components {
    schemas: {
        finances: {
            "2021"?: components["schemas"]["annee_cloture_exercice"];
        };
        annee_cloture_exercice: {
            /**
             * Format: int64
             * @example 26617000000
             */
            ca: number;
            /**
             * Format: int64
             * @example 2597000000
             */
            resultat_net: number;
        };
        /** @description Données des dirigeants personnes physiques (source : INPI) */
        dirigeant_pp: {
            /**
             * @description Nom du dirigeant
             * @example Dupont
             */
            nom?: string;
            /**
             * @description Prénom(s) du dirigeant
             * @example John
             */
            prenoms?: string;
            /**
             * @description Année de naissance du dirigeant
             * @example 1964
             */
            annee_de_naissance?: string;
            /**
             * @description Année et mois de naissance du dirigeant
             * @example 1964-09
             */
            date_de_naissance?: string;
            /**
             * @description Qualité du dirigeant
             * @example Directeur général
             */
            qualite?: string;
            /**
             * @description Nationalité du dirigeant
             * @example Française
             */
            nationalite?: string;
            /**
             * @description Type de dirgeant : "personne physique"
             * @example personne physique
             */
            type_dirigeant?: string;
        };
        /** @description Données des dirigeants personnes morales (source: INPI) */
        dirigeant_pm: {
            /** @example 784824153 */
            siren?: string;
            /** @description Dénomination de l'unité légale */
            denomination?: string;
            /**
             * @description Qualité du dirigeant
             * @example Commissaire aux comptes titulaire
             */
            qualite?: string;
            /**
             * @description Type de dirgeant : "personne morale"
             * @example personne morale
             */
            type_dirigeant?: string;
        };
        collectivite_territoriale: {
            /**
             * @description Code INSEE de la collectivité territoriale
             * @example 01
             */
            code_insee?: string;
            /**
             * @description Code de la collectivité territoriale
             * @example 01
             */
            code?: string;
            /**
             * @description Niveau de la collectivité territoriale
             * @example département
             */
            niveau?: string;
            elus?: components["schemas"]["elu"][];
        };
        elu: {
            /** @description Nom de l'élu */
            nom?: string;
            /** @description Prénom de l'élu */
            prenoms?: string;
            /**
             * @description Année de naissance de l'élu
             * @example 1964
             */
            annee_de_naissance?: string;
            /**
             * @description Fonction de l'élu
             * @example Maire
             */
            fonction?: string;
            /**
             * @description Sexe de l'élu
             * @example F
             */
            sexe?: string;
        };
    };
}
