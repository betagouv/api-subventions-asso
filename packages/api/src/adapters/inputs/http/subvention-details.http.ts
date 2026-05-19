import { Controller, Get, Hidden, Path, Response, Route, Security, Tags } from "tsoa";
import { HttpErrorInterface } from "core";
import { ProviderDetails } from "dto";
import { getProviderDetailsUseCase } from "../../../modules/grant/use-cases/get-provider-details.use-case";

@Route("subvention")
@Hidden()
@Security("jwt")
@Tags("Subvention Controller")
export class SubventionDetailsHttp extends Controller {
    /**
     * Récupère les détails d'une demande de subvention auprès de son fournisseur de données.
     *
     * @summary Détails fournisseur d'une demande de subvention
     * @param provider Identifiant du fournisseur (ex: "osiris")
     * @param idSubventionProvider Identifiant de la demande chez le fournisseur
     */
    @Get("/details/{provider}/{idSubventionProvider}")
    @Response<HttpErrorInterface>("404", "Fournisseur inconnu")
    public async getApplicationProviderDetails(
        @Path() provider: string,
        @Path() idSubventionProvider: string,
    ): Promise<ProviderDetails<unknown>> {
        return getProviderDetailsUseCase.execute(provider, idSubventionProvider);
    }
}
