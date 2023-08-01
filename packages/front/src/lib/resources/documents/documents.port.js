import requestsService from "$lib/services/requests.service";

class DocumentPort {
    async getDauphinBlob(localDauphinDocUrl) {
        return (await requestsService.get(localDauphinDocUrl, {}, { responseType: "blob" })).data;
    }
}

const documentPort = new DocumentPort();

export default documentPort;
