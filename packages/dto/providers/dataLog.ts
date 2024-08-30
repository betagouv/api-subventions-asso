export type DataLogDto = {
    identifiant_fournisseur: string;
    date_integration: Date; // Date à laquelle les données ont été ajoutées à data-subvention
    date_edition: Date; // Date à laquelle les données ont été extraites par le fournisseur
};
