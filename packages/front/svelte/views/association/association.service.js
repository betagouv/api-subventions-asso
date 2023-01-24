import axios from "axios";

import { updateSearchHistory } from "../../services/storage.service";
import { toAssociationView, toEtablissementComponent } from "./association.adapter";
import documentService from "../../services/document.service";

export class AssociationService {
    basePath = "/association/";

    async getAssociation(id) {
        const path = `/association/${id}`;
        return axios.get(path).then(result => {
            console.log(result.data.association);
            const association = toAssociationView(result.data.association);
            updateSearchHistory({
                rna: association.rna,
                siren: association.siren,
                name: association.denomination_rna || association.denomination_siren,
                objectSocial: association.objet_social || ""
            });
            return association;
        });
    }

    async getEtablissements(associationIdentifier) {
        const path = `/association/${associationIdentifier}/etablissements`;
        return axios.get(path).then(result => {
            return result.data.etablissements.map(etablissement => toEtablissementComponent(etablissement));
        });
    }

    async getDocuments(identifier) {
        return documentService.getDocuments(`/association/${identifier}/documents`);
    }
}

const associationService = new AssociationService();

export default associationService;
