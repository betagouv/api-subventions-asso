import type { AssociationIdentifierDto, DocumentDto, SiretDto } from "dto";
import type { FlatGrant } from "$lib/resources/@types/FlattenGrant";
import requestsService from "$lib/services/requests.service";
import { flattenProviderValue } from "$lib/helpers/providerValueHelper";

class EstablishmentPort {
    getResource(siret: SiretDto, resource?: string) {
        return requestsService.get(`/etablissement/${siret}${resource ? "/" + resource : ""}`);
    }

    incExtractData(siret: SiretDto) {
        this.getResource(siret, "extract-data").catch(() => null);
    }

    async getBySiret(siret: SiretDto) {
        return (await this.getResource(siret))?.data?.etablissement;
    }

    async getDocuments(siret: SiretDto): Promise<DocumentDto[]> {
        const anwser = await this.getResource(siret, "documents");
        return anwser?.data?.documents;
    }

    async getGrants(siret: SiretDto): Promise<FlatGrant[]> {
        const grants = (await this.getResource(siret, "grants")).data.subventions;
        return flattenProviderValue(grants);
    }

    async getGrantExtract(identifier: AssociationIdentifierDto) {
        const path = `/etablissement/${identifier}/grants/csv`;
        const res = await requestsService.get(path, {}, { responseType: "blob" });
        return { blob: res?.data, filename: res.headers?.["content-disposition"].match(/inline; filename=(.*)/)?.[1] };
    }
}

const establishmentPort = new EstablishmentPort();

export default establishmentPort;
