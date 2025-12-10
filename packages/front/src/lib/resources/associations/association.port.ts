import type {
    Association,
    DocumentDto,
    PaginatedAssociationNameDto,
    AssociationIdentifierDto,
    GrantFlatDto,
} from "dto";
import requestsService from "$lib/services/requests.service";

class AssociationPort {
    getResource(identifier: AssociationIdentifierDto, resource?: string) {
        return requestsService.get(`/association/${identifier}${resource ? "/" + resource : ""}`);
    }

    incExtractData(identifier) {
        this.getResource(identifier, "extract-data").catch(() => null);
    }

    async getByIdentifier(identifier: AssociationIdentifierDto): Promise<Association | undefined> {
        return (await this.getResource(identifier))?.data?.association;
    }

    async getEstablishments(identifier: AssociationIdentifierDto) {
        return (await this.getResource(identifier, "etablissements"))?.data?.etablissements;
    }

    async getGrants(identifier: AssociationIdentifierDto): Promise<GrantFlatDto[]> {
        const grants = (await this.getResource(identifier, "grants/v2"))?.data?.subventions as GrantFlatDto[];
        return grants;
    }

    async getGrantExtract(identifier: AssociationIdentifierDto) {
        const path = `/association/${identifier}/grants/csv`;
        const res = await requestsService.get(path, {}, { responseType: "blob" });
        return { blob: res?.data, filename: res.headers?.["content-disposition"].match(/inline; filename=(.*)/)?.[1] };
    }

    async getDocuments(identifier: AssociationIdentifierDto): Promise<DocumentDto[]> {
        return (await this.getResource(identifier, "documents"))?.data?.documents;
    }

    async search(lookup: string, page = 1) {
        const path = `/search/associations/${lookup}?page=${page}`;
        return (await requestsService.get(path))?.data as PaginatedAssociationNameDto;
    }
}

const associationPort = new AssociationPort();

export default associationPort;
