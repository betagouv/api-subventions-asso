import requestsService from "$lib/services/requests.service";

class RnaSirenPort {
    basePath = "/open-data/rna-siren";

    getRnaSiren(identifier) {
        const path = `${this.basePath}/${identifier}`;
        return requestsService.get(path);
    }
}

const rnaSirenPort = new RnaSirenPort();

export default rnaSirenPort;
