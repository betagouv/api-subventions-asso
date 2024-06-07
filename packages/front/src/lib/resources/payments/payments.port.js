import { NotFoundError } from "../../errors";
import { flattenProviderValue } from "$lib/helpers/providerValueHelper";
import requestsService from "$lib/services/requests.service";

class PaymentsPort {
    getEtablissementPayments(identifier) {
        return this._getPayments(identifier, "etablissement");
    }

    getAssociationPayments(associationIdentifier) {
        return this._getPayments(associationIdentifier, "association");
    }

    _getPayments(identifier, type) {
        const path = `/${type}/${identifier}/versements`;
        return requestsService
            .get(path)
            .then(result => {
                console.log("PAYMENTS :", result.data.versements);
                return result.data.versements.map(payment => flattenProviderValue(payment));
            })
            .catch(e => {
                if (e instanceof NotFoundError) return [];
                throw e;
            });
    }
}

const paymentsPort = new PaymentsPort();

export default paymentsPort;
