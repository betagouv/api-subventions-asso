import requestsService from "$lib/services/requests.service";

class RnaSirenPort {
    basePath = "/open-data/rna-siren";

    async getRnaSiren(identifier) {
        const path = `${this.basePath}/${identifier}`;
        return (await requestsService.get(path))?.data;
    }
}

const rnaSirenPort = new RnaSirenPort();

export default rnaSirenPort;
