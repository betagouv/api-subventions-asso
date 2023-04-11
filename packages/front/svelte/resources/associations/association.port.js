import axios from "axios";

class AssociationPort {
    incExtractData(identifier) {
        const path = `/association/${identifier}/extract-data`;
        axios.get(path).catch(() => null);
    }

    async getByRnaOrSiren(identifier) {
        const path = `/association/${identifier}`;
        return (await axios.get(path))?.data?.association;
    }

    async search(lookup) {
        const path = `/search/associations/${lookup}`;
        return (await axios.get(path))?.data?.result;
    }
}

const associationPort = new AssociationPort();

export default associationPort;
