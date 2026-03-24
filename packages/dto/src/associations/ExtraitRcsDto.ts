// import { ProviderValues } from "../shared/ProviderValue"
// import { Siren } from "../shared/Siren"

import { SirenDto } from "../shared/Siren";

// interface MandataireSocial {
//     "type": ProviderValues<string>,
//     "nom": ProviderValues<string>,
//     "prenom": ProviderValues<string>,
//     "fonction": ProviderValues<string>,
//     "date_naissance": ProviderValues<string>
// }

// interface Observation {
//     "numero": ProviderValues<string>,
//     "libelle": ProviderValues<string>,
//     "date": ProviderValues<string>
// }

// interface EtablissementPrincipal {
//     "activite": ProviderValues<string>,
//     "origine_fonds": ProviderValues<string>,
//     "mode_exploitation": ProviderValues<string>,
//     "code_ape": ProviderValues<string>
// }

// interface Capital {
//     "montant": ProviderValues<number>,
//     "devise": ProviderValues<string>,
//     "code_devise": ProviderValues<string>
// }

// interface Greffe {
//     "valeur": ProviderValues<string>,
//     "code": ProviderValues<string>
// }

// interface PersonneMorale {
//     "forme_juridique": {
//         "valeur": ProviderValues<string>,
//         "code": ProviderValues<string>
//     },
//     "denomination": ProviderValues<string>,
//     "date_cloture_exercice_comptable": ProviderValues<string>,
//     "date_fin_de_vie": ProviderValues<string>
// }

// interface PersonnePhysique {
//     "adresse": {
//         "nom_postal": ProviderValues<string>,
//         "numero": ProviderValues<string>,
//         "type": ProviderValues<string>,
//         "voie": ProviderValues<string>,
//         "ligne_1": ProviderValues<string>,
//         "ligne_2": ProviderValues<string>,
//         "localite": ProviderValues<string>,
//         "code_postal": ProviderValues<string>,
//         "bureau_distributeur": ProviderValues<string>,
//         "pays": ProviderValues<string>
//     },
//     "nationalite": {
//         "valeur": ProviderValues<string>,
//         "code": ProviderValues<string>
//     },
//     "nom": ProviderValues<string>,
//     "prenom": ProviderValues<string>,
//     "naissance": {
//         "pays": {
//             "valeur": ProviderValues<string>,
//             "code": ProviderValues<string>
//         },
//         "date": ProviderValues<string>,
//         "lieu": ProviderValues<string>
//     }
// }

// export default interface ExtractRcs {
//     "siren": ProviderValues<Siren>,
//     "date_extrait": ProviderValues<string>,
//     "date_immatriculation": ProviderValues<string>,
//     "mandataires_sociaux": MandataireSocial[]
//     "observations": Observation[]
//     "nom_commercial": ProviderValues<string>,
//     "etablissement_principal": EtablissementPrincipal,
//     "capital": Capital,
//     "greffe": Greffe,
//     "personne_morale": PersonneMorale,
//     "personne_physique": PersonnePhysique
// }

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

export interface ExtraitRcsDto {
    siren: SirenDto;
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
