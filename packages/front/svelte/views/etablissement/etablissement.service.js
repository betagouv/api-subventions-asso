import axios from "axios";
import { toEtablissementComponent } from "../association/association.adapter";

export class EtablissementService {
    async getById(id) {
        const path = `/etablissement/${id}`;
        return axios.get(path).then(result => {
            return toEtablissementComponent(result.data.etablissement);
        });
    }
}

const etablissementService = new EtablissementService();

export default etablissementService;
