import paymentsPort from "./payments.port";

export class PaymentsService {
    getEtablissementPayments(identifier) {
        return paymentsPort.getEtablissementPayments(identifier);
    }

    getAssociationPayments(identifier) {
        return paymentsPort.getAssociationPayments(identifier);
    }
}

const paymentsService = new PaymentsService();

export default paymentsService;
