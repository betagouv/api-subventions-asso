import { ProviderEnum } from "../../@enums/ProviderEnum";
import ProviderRequestFactory, { ProviderRequestService } from "../provider-request/providerRequest.service";
import Provider from "./@types/IProvider";

export default abstract class ProviderCore implements Provider {
    public http: ProviderRequestService;

    constructor(public readonly provider: { name: string; type: ProviderEnum; description: string; id: string }) {
        this.http = ProviderRequestFactory(this.provider.id);
    }
}
