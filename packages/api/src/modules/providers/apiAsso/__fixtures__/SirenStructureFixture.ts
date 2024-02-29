import { SirenStructureDto } from "../dto/SirenStructureDto";

export const sirenStructureFixture: SirenStructureDto = {
    identite: {
        nom: "Je suis un fause asso",
        nom_sirene: "Je suis un fause asso",
        id_siren: 1230046480,
        id_siret_siege: 123004648000021,
        id_forme_juridique: 9220,
        date_creation_sirene: "1993-01-11",
        date_modif_siren: "2019-11-28",
        active: true,
        active_sirene: true,
        regime: "loi1901",
    },
    activites: {
        id_activite_principale: "94.99Z",
        annee_activite_principale: 0,
        id_tranche_effectif: "NN",
        effectif_salarie_cent: 0,
        annee_effectif_salarie_cent: 0,
        appartenance_ess: "O",
    },
    coordonnees: {
        adresse_siege: {
            cplt_1: "Place des orties",
            num_voie: 18,
            voie: "MEURIS",
            commune: "Londre",
            code_insee: 42424,
            cp: 42424,
            type_voie: "RUE",
        },
        adresse_gestion: {
            cplt_1: "Place des orties",
            num_voie: 18,
            voie: "MEURIS",
            commune: "Londre",
            code_insee: 42424,
            cp: 42424,
            type_voie: "RUE",
        },
    },
    nbEtabsActifs: 1,
    etablissement: [
        {
            actif: true,
            adresse: {
                cplt_1: "Place des orties",
                num_voie: 18,
                voie: "MEURIS",
                commune: "Londre",
                code_insee: 42424,
                cp: 42424,
                type_voie: "RUE",
            },
            id_siret: 123004648000021,
            est_siege: true,
            date_actif: "2019-01-02",
            id_activite_principale: "94.99Z",
            annee_activite_principale: 0,
            effectif_salarie_cent: 0,
            annee_effectif_salarie_cent: 0,
        },
        {
            actif: false,
            adresse: {
                num_voie: 221,
                voie: "Baker",
                commune: "London",
                code_insee: 77777,
                cp: 77777,
                type_voie: "St",
            },
            id_siret: 123004648000013,
            est_siege: false,
            date_actif: "1993-01-10",
            id_activite_principale: "94.99Z",
            annee_activite_principale: 0,
            id_tranche_effectif: "NN",
            effectif_salarie_cent: 0,
            annee_effectif_salarie_cent: 0,
        },
    ],
};
