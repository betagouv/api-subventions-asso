import type { Association, DocumentDto, Grant, PaginatedAssociationNameDto, AssociationIdentifiers } from "dto";
import requestsService from "$lib/services/requests.service";

class AssociationPort {
    getResource(identifier: AssociationIdentifiers, resource?: string) {
        return requestsService.get(`/association/${identifier}${resource ? "/" + resource : ""}`);
    }

    incExtractData(identifier) {
        this.getResource(identifier, "extract-data").catch(() => null);
    }

    async getByIdentifier(identifier: AssociationIdentifiers): Promise<Association | undefined> {
        return (await this.getResource(identifier))?.data?.association;
    }

    async getEstablishments(identifier: AssociationIdentifiers) {
        return (await this.getResource(identifier, "etablissements"))?.data?.etablissements;
    }

    async getGrants(identifier: AssociationIdentifiers): Promise<Grant[]> {
        return (await this.getResource(identifier, "grants"))?.data?.subventions;
    }

    async getDocuments(identifier: AssociationIdentifiers): Promise<DocumentDto[]> {
        return (await this.getResource(identifier, "documents"))?.data?.documents;
    }

    async search(lookup: string, page = 1) {
        const path = `/search/associations/${lookup}?page=${page}`;
        return (await requestsService.get(path))?.data as PaginatedAssociationNameDto;
    }
}

const associationPort = new AssociationPort();

export default associationPort;
