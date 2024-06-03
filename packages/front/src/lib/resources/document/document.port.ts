import type { DocumentRequestDto } from "dto";
import requestsService from "$lib/services/requests.service";

class DocumentPort {
    async getAllDocs(identifier: string): Promise<Blob> {
        const path = `document/downloads/${identifier}`;
        return (await requestsService.get(path, {}, { responseType: "blob" }))?.data;
    }

    async getSomeDocs(docRequests: DocumentRequestDto[]): Promise<Blob> {
        const path = `document/downloads}`;
        return (await requestsService.post(path, docRequests, { responseType: "blob" }))?.data;
    }
}

const documentPort = new DocumentPort();

export default documentPort;
