export interface NbRequestsPerMonthRequestDtoSuccessResponse {
    nb_requetes_par_mois: number[];
    nb_requetes_moyen: number;
    somme_nb_requetes: number;
}

export type MonthlyRequestsDtoResponse = NbRequestsPerMonthRequestDtoSuccessResponse;
