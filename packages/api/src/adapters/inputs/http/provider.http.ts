import { Controller, Get, Route, Tags, Example } from "tsoa";
import { DataLogDto } from "dto";
import ProvidersInfos from "../../../modules/open-data/provider/entities/ProvidersInfos";
import providerService from "../../../modules/open-data/provider/open-data-provider.service";
import dataLogService from "../../../modules/data-log/dataLog.service";

@Route("open-data/fournisseurs")
@Tags("Open Data")
export class ProviderHttp extends Controller {
    /**
     * Récupérer la liste de tous nos fournisseurs de données
     *
     * @summary Récupérer la liste de tous nos fournisseurs de données
     */
    @Example<ProvidersInfos>({
        api: [{ name: "LeCompteAsso", description: "Données des dossiers de subventions" }],
        raw: [{ name: "Chorus", description: "Versements de la DGFIP" }],
    })
    @Get("/")
    async getProvidersInfos(): Promise<ProvidersInfos> {
        return await providerService.getProvidersInfos();
    }

    /**
     * @summary Historique des imports par fournisseur de données
     */
    @Example<DataLogDto[]>([
        {
            identifiant_fournisseur: "chorus",
            derniere_date_integration: new Date("2024-01-15"),
            derniere_date_edition: new Date("2024-01-15T08:00:00.000Z"),
            premiere_date_integration: new Date("2021-06-01T00:00:00.000Z"),
        },
    ])
    @Get("/historique")
    async getDataLog(): Promise<DataLogDto[]> {
        return dataLogService.getProvidersLogOverview();
    }
}
