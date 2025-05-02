import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";

export class SireneStockUniteLegaleApiPort {
    private URL = "https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip";

    private http: ProviderRequestService;

    constructor() {
        this.http = ProviderRequestFactory("sireneStockUniteLegale");
    }

    getZip() {
        return this.http.get<ReadableStream>(this.URL, { responseType: "stream" });
    }
}

const sireneStockUniteLegalePort = new SireneStockUniteLegaleApiPort();
export default sireneStockUniteLegalePort;
