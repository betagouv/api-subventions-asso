import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../../modules/provider-request/provider-request.service";
import { DataGouvPort } from "./data-gouv.port";

export class DataGouvAdapter implements DataGouvPort {
    private http: ProviderRequestService;
    private baseUrl = "https://www.data.gouv.fr/api/1/datasets/r/";
    private url: string;

    constructor(resourceId: string) {
        this.url = this.baseUrl + resourceId;
        this.http = ProviderRequestFactory("data-gouv");
    }

    getFile(): Promise<unknown> {
        return this.http.get(this.url, { responseType: "stream" });
    }
}

export const sireneStockEstablishmentAdapter = new DataGouvAdapter("a29c1297-1f92-4e2a-8f6b-8c902ce96c5f");
