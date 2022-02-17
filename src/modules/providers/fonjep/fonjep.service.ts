import { Siret } from "../../../@types/Siret";
import DemandesSubventionsProvider from "../../demandes_subventions/interfaces/DemandesSubventionsProvider";
import DemandeSubvention from "../../demandes_subventions/interfaces/DemandeSubvention";

export class FonjepService implements DemandesSubventionsProvider {


    /**
     * |----------------------------|
     * |  DemandesSubventions Part  |
     * |----------------------------|
     */

    isDemandesSubventionsProvider = true

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        return null;
    }
}

const fonjepService = new FonjepService();

export default fonjepService;