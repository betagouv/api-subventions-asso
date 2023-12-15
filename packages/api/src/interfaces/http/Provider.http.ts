import { Controller, Get, Route, Tags } from "tsoa";
import ProvidersInfos from "../../modules/_open-data/provider/entities/ProvidersInfos";
import providerService from "../../modules/_open-data/provider/provider.service";

@Route("open-data/fournisseurs")
@Tags("Open Data")
export class ProviderHttp extends Controller {
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
