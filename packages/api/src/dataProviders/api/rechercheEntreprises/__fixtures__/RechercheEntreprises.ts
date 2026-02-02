import { RechercheEntreprisesDto } from "../RechercheEntreprisesDto";

export const RECHERCHE_ENTREPRISES_DTO: RechercheEntreprisesDto = {
    results: [{ siren: "900000000", nom_complet: "RechercheEntreprise Fixture" }],
    total_pages: 2,
    page: 1,
    per_page: 2,
    total_results: 3,
};

export const EMPTY_RECHERCHE_ENTREPRISES_DTO: RechercheEntreprisesDto = {
    results: [],
    total_pages: 1,
    page: 1,
    per_page: 25,
    total_results: 0,
};
