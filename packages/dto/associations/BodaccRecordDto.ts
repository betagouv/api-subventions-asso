export interface BodaccRecordDto {
    record: {
        id: string;
        timestamp: Date;
        size: number;
        fields: {
            id: string;
            publicationavis: string;
            publicationavis_facette: string;
            parution: string;
            dateparution: string;
            numeroannonce: number;
            typeavis: string;
            typeavis_lib: string;
            familleavis: string;
            familleavis_lib: string;
            numerodepartement: string;
            departement_nom_officiel: string;
            region_code: number;
            region_nom_officiel: string;
            tribunal: string;
            commercant: string;
            ville: string;
            registre: string[];
            cp: string;
            pdf_parution_subfolder: number;
            ispdf_unitaire: string;
            listepersonnes: string;
            jugement: string;
        };
    };
}
