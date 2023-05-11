import axios from "axios";

class DocumentPort {
    async getDauphinBlob(localDauphinDocUrl) {
        return (await axios.get(localDauphinDocUrl, { responseType: "blob" })).data;
    }
}

const documentPort = new DocumentPort();

export default documentPort;
