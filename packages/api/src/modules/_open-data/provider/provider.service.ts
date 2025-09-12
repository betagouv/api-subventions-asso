import providers from "../../providers";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import IProvider from "../../providers/@types/IProvider";
import ProvidersInfos from "./entities/ProvidersInfos";

class ProviderService {
    async getProvidersInfos(): Promise<ProvidersInfos> {
        return Object.values(providers).reduce(this.splitProvidersByType, new ProvidersInfos([], []));
    }

    private splitProvidersByType(providersInfos: ProvidersInfos, service: IProvider) {
        const providerInfo = {
            name: service.meta.name,
            description: service.meta.description,
        };
        if (service.meta.type === ProviderEnum.api) providersInfos.api.push(providerInfo);
        else if (service.meta.type === ProviderEnum.raw) providersInfos.raw.push(providerInfo);
        return providersInfos;
    }
}

const providerService = new ProviderService();

export default providerService;
