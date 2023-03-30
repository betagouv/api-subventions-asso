import axios from "axios";

class AssociationPort {
    incExtractData(identifier) {
        const path = `/association/${identifier}/extract-data`;
        axios.get(path).catch(() => null);
    }
}

const associationPort = new AssociationPort();

export default associationPort;
