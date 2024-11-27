import type { AssociationIdentifiers, DocumentDto, GetGrantsResponseDto, Grant, Siret } from "dto";
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
        return ((await this.getResource(siret, "grants")).data as GetGrantsResponseDto).subventions;
    }

    async getGrantExtract(identifier: AssociationIdentifiers) {
        const path = `/etablissement/${identifier}/grants/csv`;
        const res = await requestsService.get(path, {}, { responseType: "blob" });
        return { blob: res?.data, filename: res.headers?.["content-disposition"].match(/inline; filename=(.*)/)?.[1] };
    }
}

const establishmentPort = new EstablishmentPort();

export default establishmentPort;
