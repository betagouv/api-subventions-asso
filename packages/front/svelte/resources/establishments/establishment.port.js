import requestsService from "@services/requests.service";

class EstablishmentPort {
    incExtractData(identifier) {
        const path = `/etablissement/${identifier}/extract-data`;
        requestsService.get(path).catch(() => null);
    }

    async getBySiret(identifier) {
        const path = `/etablissement/${identifier}`;
        return (await requestsService.get(path))?.data?.etablissement;
    }

    async getDocuments(identifier) {
        const anwser = await requestsService.get(`/etablissement/${identifier}/documents`);
        return anwser?.data?.documents;
    }
}

const establishmentPort = new EstablishmentPort();

export default establishmentPort;
