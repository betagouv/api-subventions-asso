import axios from "axios";

class ProvidersPort {
    getProviders() {
        const path = "/open-data/fournisseurs";

        return axios.get(path).then(result => {
            if (result.data) return result.data;
            return result;
        });
    }
}

const providersPort = new ProvidersPort();

export default providersPort;
