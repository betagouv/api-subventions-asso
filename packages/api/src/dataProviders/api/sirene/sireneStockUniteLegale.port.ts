import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";

export class SireneStockUniteLegalePort {
    private URL = "https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip";

    private http: ProviderRequestService;

    constructor() {
        this.http = ProviderRequestFactory("sireneStockUniteLegale");
    }

    getZip() {
        return this.http.get(this.URL, { responseType: "stream" });
    }
}

const sireneStockUniteLegalePort = new SireneStockUniteLegalePort();
export default sireneStockUniteLegalePort;
