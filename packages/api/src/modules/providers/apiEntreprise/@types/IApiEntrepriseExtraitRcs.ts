interface MandataireSocial {
    type: string;
    nom: string;
    prenom: string;
    fonction: string;
    date_naissance: string;
}

interface Observation {
    numero: string;
    libelle: string;
    date: string;
}

interface EtablissementPrincipal {
    activite: string;
    origine_fonds: string;
    mode_exploitation: string;
    code_ape: string;
}

interface Capital {
    montant: number;
    devise: string;
    code_devise: string;
}

interface Greffe {
    valeur: string;
    code: string;
}

interface PersonneMorale {
    forme_juridique: {
        valeur: string;
        code: string;
    };
    denomination: string;
    date_cloture_exercice_comptable: string;
    date_fin_de_vie: string;
}

interface PersonnePhysique {
    adresse: {
        nom_postal: string;
        numero: string;
        type: string;
        voie: string;
        ligne_1: string;
        ligne_2: string;
        localite: string;
        code_postal: string;
        bureau_distributeur: string;
        pays: string;
    };
    nationalite: {
        valeur: string;
        code: string;
    };
    nom: string;
    prenom: string;
    naissance: {
        pays: {
            valeur: string;
            code: string;
        };
        date: string;
        lieu: string;
    };
}

export default interface ExtractRcs {
    siren: string;
    date_extrait: string;
    date_immatriculation: string;
    mandataires_sociaux: MandataireSocial[];
    observations: Observation[];
    nom_commercial: string;
    etablissement_principal: EtablissementPrincipal;
    capital: Capital;
    greffe: Greffe;
    personne_morale: PersonneMorale;
    personne_physique: PersonnePhysique;
}
