import axios from "axios";
import { DATASUB_URL }  from "../../src/shared/config"
import { toAssociationView } from "../adapters/associationAdapter";

export class AssociationService {
    async getAssociation(id) {
        const path = `${DATASUB_URL}/association/${id}`;
        return axios.get(path).then((result) => {
            return toAssociationView(result.data.association);
        });
      }
}

const associationService = new AssociationService();

export default associationService;