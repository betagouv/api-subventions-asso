import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../../modules/provider-request/provider-request.service";
import { SireneStockUniteLegalePort } from "./sirene-stock-unite-legale.port";

export class SireneStockUniteLegaleApiAdapter implements SireneStockUniteLegalePort {
    private URL = "https://www.data.gouv.fr/api/1/datasets/r/825f4199-cadd-486c-ac46-a65a8ea1a047";

    private http: ProviderRequestService;

    constructor() {
        this.http = ProviderRequestFactory("sireneStockUniteLegale");
    }

    getZip(): Promise<unknown> {
        return this.http.get(this.URL, { responseType: "stream" });
    }
}

const sireneStockUniteLegaleAdapter = new SireneStockUniteLegaleApiAdapter();
export default sireneStockUniteLegaleAdapter;
