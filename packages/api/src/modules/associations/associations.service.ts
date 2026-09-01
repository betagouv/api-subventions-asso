import documentsService from "../documents/documents.service";
import paymentService from "../payments/payments.service";
import establishmentService from "../establishments/establishment.service";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import getSubventionsByIdentifier, {
    GetSubventionsByIdentifier,
} from "../application-flat/use-cases/get-subventions-by-identifier";

export class AssociationsService {
    constructor(private getSubventions: GetSubventionsByIdentifier) {}

    /**
     * ESTABLISHMENTS INFO
     */

    getEstablishments(identifier: AssociationIdentifier) {
        return establishmentService.getEstablishments(identifier);
    }

    /**
     *
     * GRANTS, APPLICATIONS AND PAYMENTS INFO
     *
     */

    async getDemandes(identifier: AssociationIdentifier) {
        return this.getSubventions.execute(identifier);
    }

    getPaiements(identifier: AssociationIdentifier) {
        return paymentService.getPaiements(identifier);
    }

    /**
     *
     * DOCUMENTS INFO
     *
     */

    getDocuments(identifier: AssociationIdentifier) {
        return documentsService.getDocuments(identifier);
    }
}

const associationsService = new AssociationsService(getSubventionsByIdentifier);

export default associationsService;
