import requestsService from "$lib/services/requests.service";

class DocumentPort {
    async getBlob(proxiedDocUrl) {
        return (await requestsService.get(proxiedDocUrl, {}, { responseType: "blob" })).data;
    }
}

const documentPort = new DocumentPort();

export default documentPort;
