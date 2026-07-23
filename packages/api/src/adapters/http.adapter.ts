import ProviderRequestFactory, { ProviderRequestService } from "../modules/provider-request/provider-request.service";

export abstract class HttpAdapter {
    protected http: ProviderRequestService;
    public name: string;

    constructor(adapterName: string) {
        this.name = adapterName;
        this.http = ProviderRequestFactory(adapterName);
    }
}
