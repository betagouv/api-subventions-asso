import { HttpErrorInterface } from "core";
import { PaginatedAssociationNameDto } from "dto";
import { Controller, Example, Get, Path, Query, Response, Route, Security, SuccessResponse, Tags } from "tsoa";

import searchService from "../../modules/search/search.service";

@Route("search")
@Security("jwt")
@Tags("Search Controller")
export class SearchHttp extends Controller {
    /**
     * Recherche des associations via rna, siren et nom partiel ou complet
     * @summary Recherche des associations via rna, siren et nom partiel ou complet
     * @param input Identifiant RNA ou Identifiant Siren ou Nom d'une association (peut-être encodé via encodeURIComponent())
     * @param page Numéro de page des résultats (commence à 1, défaut : 1)
     */
    @Example<PaginatedAssociationNameDto>({
        results: [
            {
                siren: "123456789",
                name: "Association Exemple",
                rna: "W123456789",
                address: {
                    numero: "10",
                    voie: "Rue de l'Exemple",
                    code_postal: "75000",
                    commune: "Paris",
                },
                nbEtabs: 2,
            },
        ],
        nbPages: 3,
        page: 1,
        total: 27,
    })
    @Get("/associations/{input}")
    @SuccessResponse(200)
    @Response<HttpErrorInterface>("404", "Aucune association trouvée", {
        message: "Could not match any association with given input : ${input}",
    })
    public findAssociations(@Path() input: string, @Query() page = "1"): Promise<PaginatedAssociationNameDto> {
        return searchService.getAssociationsKeys(decodeURIComponent(input), Number.parseInt(page));
    }
}
