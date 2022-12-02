import providersPort from "./providers.port";

export class ProvidersService {
    getProviders() {
        return providersPort.getProviders();
    }
}

const providersService = new ProvidersService();

export default providersService;
