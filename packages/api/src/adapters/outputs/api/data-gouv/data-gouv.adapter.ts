import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../../modules/provider-request/provider-request.service";
import { DataGouvPort } from "./data-gouv.port";

export class DataGouvAdapter implements DataGouvPort {
    private http: ProviderRequestService;
    private baseUrl = "https://www.data.gouv.fr/api/1/datasets/r/";
    private url: string;

    constructor(rid: string) {
        this.url = this.baseUrl + rid;
        this.http = ProviderRequestFactory("data-gouv");
    }

    getFile(): Promise<unknown> {
        return this.http.get(this.url, { responseType: "stream" });
    }
}

export const sireneStockUniteLegaleAdapter = new DataGouvAdapter("825f4199-cadd-486c-ac46-a65a8ea1a047");
export const rnaWaldecAdapter = new DataGouvAdapter("cc7b8f0c-45ea-4444-8b55-55d30bc34ac5");
