import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";

export class SireneStockUniteLegaleApiPort {
   // private URL = "https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip";
    private URL = "https://www.data.gouv.fr/fr/datasets/r/825f4199-cadd-486c-ac46-a65a8ea1a047"

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
