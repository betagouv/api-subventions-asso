import axios from "axios";
// Voir si il ne vaux mieux pas passer ça en adapteur
import { flatenProviderValue } from "../../helpers/providerValueHelper";

class VersementsPort {
    getEtablissementVersements(identifier) {
        return this._getVersements(identifier, "etablissement");
    }

    getAssociationVersements(associationIdentifier) {
        return this._getVersements(associationIdentifier, "association");
    }

    _getVersements(identifier, type) {
        const path = `/${type}/${identifier}/versements`;
        return axios
            .get(path)
            .then(result => {
                return result.data.versements.map(versement => flatenProviderValue(versement));
            })
            .catch(e => {
                if (e.request.status == 404) return [];
                throw e;
            });
    }
}

const versementsPort = new VersementsPort();

export default versementsPort;
