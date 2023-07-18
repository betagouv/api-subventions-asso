import requestsService from "@services/requests.service";

class ProvidersPort {
    getProviders() {
        const path = "/open-data/fournisseurs";

        return requestsService.get(path).then(result => {
            if (result.data) return result.data;
            return result;
        });
    }
}

const providersPort = new ProvidersPort();

export default providersPort;
