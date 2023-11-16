import { Controller, Get, Route, Tags } from "tsoa";
import ProvidersInfos from "../../entities/ProvidersInfos";
import providerService from "../../provider.service";

@Route("open-data/fournisseurs")
@Tags("Open Data")
export class ProviderController extends Controller {
    /**
     * Récupérer la liste de tous nos fournisseurs de données
     *
     * @summary Récupérer la liste de tous nos fournisseurs de données
     */
    @Get("/")
    async getProvidersInfos(): Promise<ProvidersInfos> {
        return await providerService.getProvidersInfos();
    }
}
