import { RnaStructureDto } from "../dto/RnaStructureDto";

export const rnaStructureFixture: RnaStructureDto = {
    identite: {
        nom: "Asso qui n'existe pas",
        sigle: "Asso qui n'existe p...",
        id_rna: "W000000000",
        date_pub_jo: "1998-02-07",
        date_modif_rna: "2023-01-12",
        active: true,
        nature: "Simplement déclarée",
        util_publique: true,
        date_publication_util_publique: "2018-05-13",
    },
    activites: {
        objet: "Object social !",
        lib_objet_social1: "conduite d'activités économiques",
        annee_activite_principale: 0,
        effectif_salarie_cent: 0,
        annee_effectif_salarie_cent: 0,
    },
    coordonnees: {
        adresse_siege: {
            cplt_1: "Place des orties",
            num_voie: 18,
            voie: "MEURIS",
            commune: "Londre",
            cp: 42424,
            type_voie: "RUE",
        },
        adresse_gestion: {
            cplt_1: "Place des orties",
            voie: "MEURIS",
            commune: "Londre",
            cp: 42424,
            pays: "Groenland",
        },
    },
};
