import associationPort from "./association.port";

class AssociationService {
    incExtractData(identifier) {
        associationPort.incExtractData(identifier);
    }
}

const associationService = new AssociationService();

export default associationService;
