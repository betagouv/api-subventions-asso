import axios from "axios";

class AssociationPort {
    incExtractData(identifier) {
        const path = `/association/${identifier}/extract-data`;
        axios.get(path).catch(() => null);
    }

    async getByIdentifier(identifier) {
        const path = `/association/${identifier}`;
        return (await axios.get(path))?.data?.association;
    }

    async getEstablishments(identifier) {
        const path = `/association/${identifier}/etablissements`;
        const result = await axios.get(path);
        return result?.data?.etablissements;
    }

    async getDocuments(identifier) {
        const path = `association/${identifier}/documents`;
        return await axios.get(path)?.data?.documents;
    }

    async search(lookup) {
        const path = `/search/associations/${lookup}`;
        return (await axios.get(path))?.data?.result;
    }
}

const associationPort = new AssociationPort();

export default associationPort;
