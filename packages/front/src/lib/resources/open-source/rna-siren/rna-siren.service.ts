import rnaSirenPort from "./rna-siren.port";

class RnaSirenService {
    getAssociatedIdentifier(identifier) {
        return rnaSirenPort.getRnaSiren(identifier);
    }
}

const rnaSirenService = new RnaSirenService();
export default rnaSirenService;
