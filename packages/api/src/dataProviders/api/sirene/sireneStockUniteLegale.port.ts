import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";

export class SireneStockUniteLegaleApiPort {
    private URL = "https://object.files.data.gouv.fr/data-pipeline-open/siren/stock/StockUniteLegale_utf8.zip";

    private http: ProviderRequestService;

    constructor() {
        this.http = ProviderRequestFactory("sireneStockUniteLegale");
    }

    getZip() {
        return this.http.get(this.URL, { responseType: "stream" });
    }
}

const sireneStockUniteLegalePort = new SireneStockUniteLegaleApiPort();
export default sireneStockUniteLegalePort;
