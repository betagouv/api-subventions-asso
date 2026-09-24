import { Controller, Get, Response, Route, Security, Tags, Query, Path, Example } from "tsoa";
import { HttpErrorInterface } from "core";
import searchService from "../../../../modules/search/search.service";
import { RechercheAssociationDto, PaginatedResultDto } from "dto";
import { toDto } from "./search.mapper";

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
    @Example<PaginatedResultDto<RechercheAssociationDto[]>>({
        resultats: [
            {
                siren: "123456789",
                rna: "W751234567",
                siretSiege: "12345678900018",
                name: "Association Exemple",
                adresse: {
                    numero: "3",
                    type_voie: "rue",
                    code_postal: "35000",
                    voie: "de Paris",
                    commune: "Rennes",
                },
                nbEtabs: 1,
            },
        ],
        nbPages: 1,
        page: 1,
        total: 1,
    })
    @Get("/associations/{input}")
    @Response<HttpErrorInterface>("404", "Aucune association trouvée", {
        message: "Could not match any association with given input : ${input}",
    })
    @Response<HttpErrorInterface>("400", "Code postal invalide")
    public async search(
        @Path() input: string,
        @Query() page = "1",
        @Query() postalCode?: string,
    ): Promise<PaginatedResultDto<RechercheAssociationDto[]>> {
        // @TODO: transform in use case
        const { results, ...search } = await searchService.getPaginatedResult(
            decodeURIComponent(input),
            Number.parseInt(page),
            postalCode,
        );
        return {
            ...search,
            resultats: results.map(toDto),
        };
    }
}
