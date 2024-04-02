import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";

export class DataBretagnePort {
    private basepath = "https://api.databretagne.fr/budget/api/v1/";
    private http: ProviderRequestService;
    constructor() {
        this.http = ProviderRequestFactory("data-bretagne");
    }
}

const dataBretagnePort = new DataBretagnePort();
export default dataBretagnePort;
