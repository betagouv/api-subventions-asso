import establishmentPort from "./establishment.port";

class EstablishmentService {
    incExtractData(identifier) {
        establishmentPort.incExtractData(identifier);
    }
}

const establishmentService = new EstablishmentService();

export default establishmentService;
