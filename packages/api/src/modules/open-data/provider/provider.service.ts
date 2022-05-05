import ProvidersInfos from './entities/ProvidersInfos';
import providers from "../../providers";
import { ProviderEnum } from '../../../@enums/ProviderEnum';
import IProvider from '../../providers/@types/IProvider';

class ProviderService {
    async getProvidersInfos(): Promise<ProvidersInfos> {
        return Object.values(providers).reduce(this.splitProvidersByType, new ProvidersInfos([], []))
    }

    private splitProvidersByType(providersInfos: ProvidersInfos, service: IProvider) {
        const providerInfo = { name: service.provider.name, description: service.provider.description }
        if (service.provider.type === ProviderEnum.api) providersInfos.api.push(providerInfo)
        else providersInfos.raw.push(providerInfo);
        return providersInfos;
    }
}

const providerService = new ProviderService();

export default providerService