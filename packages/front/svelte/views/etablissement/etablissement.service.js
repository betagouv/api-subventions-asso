import axios from "axios";
import { toEtablissementComponent } from "../association/association.adapter";
import documentService from "../../services/document.service";
import { getValue } from "../../helpers/providerValueHelper";

export class EtablissementService {
    getContactsList(etablissement) {
        return etablissement.contacts?.map(contact => getValue(contact));
    }

    async getById(id) {
        const path = `/etablissement/${id}`;
        return axios.get(path).then(result => {
            const etablissement = result.data.etablissement;
            // TODO: think about another way to handle contacts (not as a ProviderValues)
            // When contacts is a ProviderValues, only the first element is returned and this is not the behavior we want for contacts
            return {
                ...toEtablissementComponent(etablissement),
                contacts: etablissementService.getContactsList(etablissement),
            };
        });
    }

    async getDocuments(siret) {
        return documentService.getDocuments(`/etablissement/${siret}/documents`);
    }

    getEtablissementStatus(etab) {
        if (etab.siege) return "Établissement siège";
        if (!etab.ouvert) return "-- Établissement fermé --";
        return "Établissement secondaire";
    }
}

const etablissementService = new EtablissementService();

export default etablissementService;
