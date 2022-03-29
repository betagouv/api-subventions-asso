import { Siren, Siret } from "@api-subventions-asso/dto";
import providers from "../providers";
import DemandesSubventionsProvider from "./interfaces/DemandesSubventionsProvider";
import DemandeSubvention from "./interfaces/DemandeSubvention";

export class DemandesSubventionsService {

    async getDemandeSubventionsBySiret(siret: Siret) {
        const data = await (await this.aggregateSiret(siret)).filter(asso => asso) as DemandeSubvention[];

        if (!data.length) return null;

        return data;
    }

    async getDemandeSubventionsBySiren(siren: Siren) {
        const data = await (await this.aggregateSiren(siren)).filter(asso => asso) as DemandeSubvention[];

        if (!data.length) return null;

        return data;
    }

    private async aggregateSiret(siret: Siret): Promise<(DemandeSubvention | null)[]> {
        const associationProviders = Object.values(providers).filter((p) => (p as DemandesSubventionsProvider).isDemandesSubventionsProvider) as DemandesSubventionsProvider[]
        return[...(await Promise.all(
            associationProviders.map( p => p.getDemandeSubventionBySiret(siret))
        )).flat()];
    }

    private async aggregateSiren(siren: Siren): Promise<(DemandeSubvention | null)[]> {
        const associationProviders = Object.values(providers).filter((p) => (p as DemandesSubventionsProvider).isDemandesSubventionsProvider) as DemandesSubventionsProvider[]
        return[...(await Promise.all(
            associationProviders.map( p => p.getDemandeSubventionBySiren(siren))
        )).flat()];
    }

}

const demandesSubventionsService = new DemandesSubventionsService();

export default demandesSubventionsService;