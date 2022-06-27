import axios from "axios";
import { toAssociationView, toEtablissementComponent } from "./association.adapter";

export class AssociationService {
    async getAssociation(id) {
        const path = `/association/${id}`;
        return axios.get(path).then((result) => {
            return toAssociationView(result.data.association);
        });
    }

    async getEtablissements(associationIdentifier) {
        const path = `/association/${associationIdentifier}/etablissements`;
        return axios.get(path).then((result) => {
            return result.data.etablissements.map(etablissement => toEtablissementComponent(etablissement))
        });
    }
}

const associationService = new AssociationService();

export default associationService;