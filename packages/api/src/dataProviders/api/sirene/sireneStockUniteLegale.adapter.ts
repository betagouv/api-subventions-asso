import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";

export class SireneStockUniteLegaleApiAdapter {
    private URL = "https://object.files.data.gouv.fr/data-pipeline-open/siren/stock/StockUniteLegale_utf8.zip";

    private http: ProviderRequestService;

    constructor() {
        this.http = ProviderRequestFactory("sireneStockUniteLegale");
    }

    getZip() {
        return this.http.get(this.URL, { responseType: "stream" });
    }
}

const sireneStockUniteLegaleAdapter = new SireneStockUniteLegaleApiAdapter();
export default sireneStockUniteLegaleAdapter;
