import { Route, Get, Controller, Tags, Security, Response } from "tsoa";
import { HttpErrorInterface } from "../../../../shared/errors/httpErrors/HttpError";
import AssociationNameEntity from "../../../association-name/entities/AssociationNameEntity";

import searchService from "../../search.service";

@Route("search")
@Security("jwt")
@Tags("Search Controller")
export class SearchController extends Controller {
    /**
     * Recherche une association via son rna, siren et nom partiel ou complet
     * @summary Recherche une association via son rna, siren et nom partiel ou complet
     * @param rna_or_siren Identifiant RNA ou Identifiant Siren
     */
    @Get("/associations/{input}")
    @Response<HttpErrorInterface>("404", "Aucune association retrouvée", {
        message: "Could match any association with given input : ${input}",
    })
    public async findAssociations(input: string): Promise<{ result: AssociationNameEntity[] }> {
        const result = await searchService.getAssociationsKeys(input);
        if (result.length === 0) this.setStatus(204);
        return { result };
    }
}
