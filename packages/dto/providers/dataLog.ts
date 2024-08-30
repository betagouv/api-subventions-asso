export type DataLogDto = {
    identifiant_fournisseur: string;
    date_integration: Date; // Date à la quelle les données à été ajouter a data-subvention
    date_edition: Date; // Date à la quelle les données on été extraite par le fournisseur
};
