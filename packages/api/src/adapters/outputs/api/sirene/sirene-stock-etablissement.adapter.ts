import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../../modules/provider-request/provider-request.service";
import { SireneStockEtablissementPort, SireneStockEtablissementResponse } from "./sirene-stock-etablissement.port";

export class SireneStockEtablissementAdapter implements SireneStockEtablissementPort {
    private URL = "https://www.data.gouv.fr/api/1/datasets/r/a29c1297-1f92-4e2a-8f6b-8c902ce96c5f";

    private http: ProviderRequestService;

    constructor() {
        this.http = ProviderRequestFactory("sireneStockEtablissement");
    }

    getParquet(): Promise<SireneStockEtablissementResponse> {
        return this.http.get(this.URL, { responseType: "stream" }) as Promise<SireneStockEtablissementResponse>;
    }
}

const sireneStockEtablissementAdapter = new SireneStockEtablissementAdapter();
export default sireneStockEtablissementAdapter;
