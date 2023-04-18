export interface NbVisitsPerMonthRequestDtoSuccessResponse {
    nb_visites_par_mois: number[];
    nb_visites_moyen: number;
    somme_nb_visites: number;
}

export type MonthlyVisitsDtoResponse = NbVisitsPerMonthRequestDtoSuccessResponse;
