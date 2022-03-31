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
        const demandesSubventionsProviders = this.getDemandesSubventionsProviders();
        return [...(await Promise.all(
            demandesSubventionsProviders.map(p => p.getDemandeSubventionBySiret(siret))
        )).flat()];
    }

    private async aggregateSiren(siren: Siren): Promise<(DemandeSubvention | null)[]> {
        const demandesSubventionsProviders = this.getDemandesSubventionsProviders();
        return [...(await Promise.all(
            demandesSubventionsProviders.map(p => p.getDemandeSubventionBySiren(siren))
        )).flat()];
    }

    private getDemandesSubventionsProviders() {
        return Object.values(providers).filter((p) => (p as DemandesSubventionsProvider).isDemandesSubventionsProvider) as DemandesSubventionsProvider[];
    }
}

const demandesSubventionsService = new DemandesSubventionsService();

export default demandesSubventionsService;