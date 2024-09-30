export type DataLogDto = {
    identifiant_fournisseur: string;
    derniere_date_integration: Date; // Date à laquelle les données ont été ajoutées à data-subvention
    derniere_date_edition: Date; // Date à laquelle les données ont été extraites par le fournisseur
    premiere_date_integration: Date;
};
