import { Siret } from "../../@types";
import providers from "../providers";
import DemandesSubventionsProvider from "./interfaces/DemandesSubventionsProvider";
import DemandeSubvention from "./interfaces/DemandeSubvention";

export class DemandesSubventionsService {

    async getDemandeSubventionsBySiret(siret: Siret) {
        const data = await (await this.aggregate(siret)).filter(asso => asso) as DemandeSubvention[];

        if (!data.length) return null;

        return data;
    }

    private async aggregate(siret: Siret): Promise<(DemandeSubvention | null)[]> {
        const associationProviders = Object.values(providers).filter((p) => (p as DemandesSubventionsProvider).isDemandesSubventionsProvider) as DemandesSubventionsProvider[]
        return[...(await Promise.all(
            associationProviders.map( p => p.getDemandeSubventionBySiret(siret))
        )).flat()];
    }

}

const demandesSubventionsService = new DemandesSubventionsService();

export default demandesSubventionsService;