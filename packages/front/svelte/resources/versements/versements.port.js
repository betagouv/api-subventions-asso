import { NotFoundError } from "../../errors";
import { flatenProviderValue } from "../../helpers/providerValueHelper";
import requestsService from "@services/requests.service";
// Voir s'il ne vaut mieux pas passer ça en adapter

class VersementsPort {
    getEtablissementVersements(identifier) {
        return this._getVersements(identifier, "etablissement");
    }

    getAssociationVersements(associationIdentifier) {
        return this._getVersements(associationIdentifier, "association");
    }

    _getVersements(identifier, type) {
        const path = `/${type}/${identifier}/versements`;
        return requestsService
            .get(path)
            .then(result => {
                return result.data.versements.map(versement => flatenProviderValue(versement));
            })
            .catch(e => {
                if (e instanceof NotFoundError) return [];
                throw e;
            });
    }
}

const versementsPort = new VersementsPort();

export default versementsPort;
