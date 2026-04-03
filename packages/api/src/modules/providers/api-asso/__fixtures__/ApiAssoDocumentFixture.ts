import { StructureDacDocumentDto, StructureRnaDocumentDto } from "../dto/StructureDto";

export const ApiAssoDocumentFixture = {
    asso: {
        documents: {
            nbDocDac: 1,
            document_dac: [
                {
                    url: "/fake/url",
                    nom: "nom fake",
                    meta: {
                        type: "BPA",
                        id_siret: 50922194100000,
                        etat: "courant",
                    },
                    time_depot: "2021-06-18 12:02:53",
                },
            ] as StructureDacDocumentDto[],
            nbDocRna: 1,
            document_rna: [
                {
                    url: "/fake/url",
                    type: "PV",
                    sous_type: "PV",
                    id: "ididididid",
                    lib_sous_type: "PV",
                    time: 1622557171,
                    annee: 2021,
                },
            ] as StructureRnaDocumentDto[],
        },
    },
};
