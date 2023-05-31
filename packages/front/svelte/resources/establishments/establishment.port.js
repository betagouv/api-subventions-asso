import axios from "axios";

class EstablishmentPort {
    incExtractData(identifier) {
        const path = `/etablissement/${identifier}/extract-data`;
        axios.get(path).catch(() => null);
    }

    async getBySiret(identifier) {
        const path = `/etablissement/${identifier}`;
        return await axios.get(path)?.data?.etablissement;
    }

    getDocuments(identifier) {
        return axios.get(`/etablissement/${identifier}/documents`);
    }
}

const establishmentPort = new EstablishmentPort();

export default establishmentPort;
