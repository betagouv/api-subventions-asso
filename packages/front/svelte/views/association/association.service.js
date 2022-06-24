import axios from "axios";
import { toAssociationView } from "./association.adapter";

export class AssociationService {
    async getAssociation(id) {
        const path = `/association/${id}`;
        return axios.get(path).then((result) => {
            return toAssociationView(result.data.association);
        });
      }
}

const associationService = new AssociationService();

export default associationService;