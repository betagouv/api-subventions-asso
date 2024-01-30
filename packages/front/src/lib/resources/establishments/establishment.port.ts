import type { Document } from "dto";
import requestsService from "$lib/services/requests.service";

class EstablishmentPort {
    incExtractData(identifier) {
        const path = `/etablissement/${identifier}/extract-data`;
        requestsService.get(path).catch(() => null);
    }

    async getBySiret(identifier) {
        const path = `/etablissement/${identifier}`;
        return (await requestsService.get(path))?.data?.etablissement;
    }

    async getDocuments(identifier): Promise<Document[]> {
        const anwser = await requestsService.get(`/etablissement/${identifier}/documents`);
        return anwser?.data?.documents;
    }
}

const establishmentPort = new EstablishmentPort();

export default establishmentPort;
