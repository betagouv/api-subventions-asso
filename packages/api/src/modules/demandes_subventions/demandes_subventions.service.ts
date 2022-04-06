import { Siren, Siret } from "@api-subventions-asso/dto";
import providers from "../providers";
import DemandesSubventionsProvider from "./@types/DemandesSubventionsProvider";
import DemandeSubvention from "./@types/DemandeSubvention";

export class DemandesSubventionsService {

    async getDemandeSubventionsBySiret(siret: Siret) {
        const data = await (await this.aggregate(siret, "SIRET")).filter(asso => asso) as DemandeSubvention[];

        if (!data.length) return null;

        return data;
    }

    async getDemandeSubventionsBySiren(siren: Siren) {
        const data = await (await this.aggregate(siren, "SIREN")).filter(asso => asso) as DemandeSubvention[];

        if (!data.length) return null;

        return data;
    }


    private async aggregate(id: Siren | Siret, type: "SIRET" | "SIREN") {
        const demandesSubventionsProviders = this.getDemandesSubventionsProviders();
        return [...(await Promise.all(
            type === "SIREN"
                ? demandesSubventionsProviders.map(p => p.getDemandeSubventionBySiren(id))
                : demandesSubventionsProviders.map(p => p.getDemandeSubventionBySiret(id))
        )).flat()];
    }

    private getDemandesSubventionsProviders() {
        return Object.values(providers).filter((p) => (p as DemandesSubventionsProvider).isDemandesSubventionsProvider) as DemandesSubventionsProvider[];
    }
}

const demandesSubventionsService = new DemandesSubventionsService();

export default demandesSubventionsService;