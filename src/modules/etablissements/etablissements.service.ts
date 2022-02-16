import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";
import EtablissementDtoAdapter from "../providers/dataEntreprise/adapters/EtablisementDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdatper";
import EtablissementProvider from "./interfaces/EtablissementProvider";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import Etablissement from "./interfaces/Etablissement";
import providers from "../providers";

import { ProviderValues } from "../../@types/ProviderValue";
import { DefaultObject } from "../../@types/utils";
import { Siret } from "../../@types/Siret";

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

    private async aggregate(siret: Siret): Promise<(Etablissement[] | null)[]> {
        const etablissementProviders = Object.values(providers).filter(this.isEtablissementProvider) as EtablissementProvider[];
        return Promise.all(
            etablissementProviders.map(p => p.getEtablissementsBySiret(siret))
        );
    }

    private isEtablissementProvider(data: unknown): data is EtablissementProvider {
        return (data as EtablissementProvider).isEtablissementProvider;
    }
}

const etablissementService = new EtablissementsService();

export default etablissementService;