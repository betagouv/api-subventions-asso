import axios from "axios";

class EstablishmentPort {
    incExtractData(identifier) {
        const path = `/etablissement/${identifier}/extract-data`;
        axios.get(path).catch(e => null);
    }
}

const establishmentPort = new EstablishmentPort();

export default establishmentPort;
