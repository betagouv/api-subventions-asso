import type { Association } from "dto";
import requestsService from "$lib/services/requests.service";

class AssociationPort {
    incExtractData(identifier) {
        const path = `/association/${identifier}/extract-data`;
        requestsService.get(path).catch(() => null);
    }

    async getByIdentifier(identifier): Promise<Association | undefined> {
        const path = `/association/${identifier}`;
        return (await requestsService.get(path))?.data?.association;
    }

    async getEstablishments(identifier) {
        const path = `/association/${identifier}/etablissements`;
        return (await requestsService.get(path))?.data?.etablissements;
    }

    async getDocuments(identifier) {
        const path = `association/${identifier}/documents`;
        return (await requestsService.get(path))?.data?.documents;
    }

    async search(lookup) {
        const path = `/search/associations/${lookup}`;
        return (await requestsService.get(path))?.data?.result;
    }
}

const associationPort = new AssociationPort();

export default associationPort;
