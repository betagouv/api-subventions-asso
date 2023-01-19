import { ErrorResponse } from "@api-subventions-asso/dto";
import { Route, Get, Controller, Tags, Security, Response } from "tsoa";
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
    @Response<ErrorResponse>("404", "Aucune association retrouvée", {
        message: "Could match any association with given input : ${input}"
    })
    public async findAssociations(input: string): Promise<{ result: AssociationNameEntity[] } | ErrorResponse> {
        const result = await searchService.getAssociationsKeys(input);
        if (!result || (Array.isArray(result) && result.length == 0)) {
            this.setStatus(404);
            return {
                message: `Could match any association with given input : ${input}`
            };
        }
        this.setStatus(200);
        return { result };
    }
}
