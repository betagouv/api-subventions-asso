import { Controller, Get, Response, Route, Security, Tags, Query, Path } from "tsoa";
import { PaginatedAssociationNameDto } from "dto";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";

import searchService from "../../modules/search/search.service";

@Route("search")
@Security("jwt")
@Tags("Search Controller")
export class SearchHttp extends Controller {
    /**
     * Recherche une association via son rna, siren et nom partiel ou complet
     * @summary Recherche une association via son rna, siren et nom partiel ou complet
     * @param input Identifiant RNA ou Identifiant Siren ou Nom d'une association (peut-être encodé via encodeURIComponent())
     * @param page default to 1
     */
    @Get("/associations/{input}")
    @Response<HttpErrorInterface>("404", "Aucune association trouvée", {
        message: "Could not match any association with given input : ${input}",
    })
    public findAssociations(@Path() input: string, @Query() page = "1"): Promise<PaginatedAssociationNameDto> {
        return searchService.getAssociationsKeys(decodeURIComponent(input), Number.parseInt(page));
    }
}
