import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";
import EtablissementDtoAdapter from "../providers/dataEntreprise/adapters/EtablisementDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import EtablissementProvider from "./interfaces/EtablissementProvider";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import Etablissement from "./interfaces/Etablissement";
import providers from "../providers";

import { ProviderValues, DefaultObject, Siret } from "../../@types";

export class EtablissementsService {
    
    private provider_score: DefaultObject<number> = {
        [EtablissementDtoAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [LeCompteAssoRequestAdapter.PROVIDER_NAME]: 0.5
    }

    async getEtablissement(siret: Siret) {
        const data = await (await this.aggregate(siret)).flat().filter(d => d) as Etablissement[];
        
        if (!data.length) return null;

        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Etablissement;
    }

    private async aggregate(siret: Siret): Promise<(Etablissement[])> {
        const etablissementProviders = Object.values(providers).filter(this.isEtablissementProvider) as EtablissementProvider[];

        return await etablissementProviders.reduce(async (acc, provider) => {
            const result = await acc;
            const etablissements = await provider.getEtablissementsBySiret(siret, true);
            if (etablissements) {
                result.push(...etablissements.flat());
            }

            return result;
        }, Promise.resolve([]) as Promise<Etablissement[]>);
    }

    private isEtablissementProvider(data: unknown): data is EtablissementProvider {
        return (data as EtablissementProvider).isEtablissementProvider;
    }
}

const etablissementService = new EtablissementsService();

export default etablissementService;