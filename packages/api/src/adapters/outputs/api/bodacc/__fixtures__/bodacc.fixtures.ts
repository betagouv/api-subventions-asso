import { BodaccDto, BodaccRecordDto } from "../bodacc.dto";

export const BODACC_RECORD: BodaccRecordDto = {
    size: 1,
    timestamp: new Date("2026-01-04"),
    id: "ID_BODACC",
    fields: {
        id: "A202400353292",
        publicationavis: "",
        publicationavis_facette: "",
        parution: "",
        dateparution: "2020-01-02",
        numeroannonce: 20,
        typeavis: "",
        typeavis_lib: "Avis initial",
        familleavis: "",
        familleavis_lib: "Procédures collectives",
        numerodepartement: "35",
        departement_nom_officiel: "Ile-et-Vilaine",
        region_code: 53,
        region_nom_officiel: "Bretagne",
        tribunal: "Greffe du Tribunal Judiciaire de Rennes",
        commercant: "",
        ville: "",
        registre: [],
        cp: "",
        pdf_parution_subfolder: 1,
        ispdf_unitaire: "",
        listepersonnes: "",
        jugement: "",
    },
};

export const BODACC_RESPONSE: BodaccDto = {
    total_count: 1,
    records: [
        {
            record: BODACC_RECORD,
        },
    ],
};
