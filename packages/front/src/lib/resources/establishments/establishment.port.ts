import type { DocumentDto, Grant, Siret } from "dto";
import requestsService from "$lib/services/requests.service";

class EstablishmentPort {
    getResource(siret: Siret, resource?: string) {
        return requestsService.get(`/etablissement/${siret}${resource ? "/" + resource : ""}`);
    }

    incExtractData(siret: Siret) {
        this.getResource(siret, "extract-data").catch(() => null);
    }

    async getBySiret(siret: Siret) {
        return (await this.getResource(siret))?.data?.etablissement;
    }

    async getDocuments(siret: Siret): Promise<DocumentDto[]> {
        const anwser = await this.getResource(siret, "documents");
        return anwser?.data?.documents;
    }

    async getGrants(siret: Siret): Promise<Grant[]> {
        return (await this.getResource(siret, "grants"))?.data?.subventions;
    }
}

const establishmentPort = new EstablishmentPort();

export default establishmentPort;
