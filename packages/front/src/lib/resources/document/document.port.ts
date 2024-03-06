import requestsService from "$lib/services/requests.service";

class DocumentPort {
    async getAllDocs(identifier): Promise<Blob> {
        const path = `document/downloads/${identifier}`;
        return (await requestsService.get(path, {}, { responseType: "blob" }))?.data;
    }
}

const documentPort = new DocumentPort();

export default documentPort;
