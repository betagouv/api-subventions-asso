import { ProviderValues, Siren, Siret, Etablissement } from "@api-subventions-asso/dto";

import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";
import EtablissementDtoAdapter from "../providers/dataEntreprise/adapters/EtablissementDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import { DefaultObject } from "../../@types";
import EtablissementProvider from "./@types/EtablissementProvider";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import providers from "../providers";
import FonjepEntityAdapter from "../providers/fonjep/adapters/FonjepEntityAdapter";
import subventionsService from '../subventions/subventions.service';
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";
import { isSiren } from '../../shared/Validators';

export class EtablissementsService {
    
    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [EtablissementDtoAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [LeCompteAssoRequestAdapter.PROVIDER_NAME]: 0.5,
        [FonjepEntityAdapter.PROVIDER_NAME]: 0.5
    }

    async getEtablissement(siret: Siret) {
        const data = await this.aggregate(siret);
        if (!data.length) return null;
        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown"
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Etablissement;
    }

    async getEtablissementsBySiren(siren: Siren) {
        const data = await this.aggregate(siren);
        
        if (!data.length) return null;

        const groupBySiret = data.reduce((acc, etablissement) => {
            const siret = etablissement.siret[0].value;

            if (!siret) return acc;

            if (!acc[siret]) acc[siret] = [];
            acc[siret].push(etablissement);

            return acc;
        }, {} as DefaultObject<Etablissement[]>);
        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown"
        return Object.values(groupBySiret).map(etablissements => FormaterHelper.formatData(etablissements as DefaultObject<ProviderValues>[], this.provider_score) as Etablissement)
    }

    async getSubventions(siret: Siret) {
        return await subventionsService.getDemandesByEtablissement(siret);
    }

    private async aggregate(id: Siren | Siret) {
        const getter = isSiren(id) ? "getEtablissementsBySiren" : "getEtablissementsBySiret"
        const etablisementProviders = this.getEtablissementProviders();
        
        const promises = etablisementProviders.map(async provider => { 
            const etabs = await provider[getter](id, true);
            if (etabs) return etabs;
            else return null;
        });
        return (await Promise.all(promises)).flat().flat().filter(etablissement => etablissement) as Etablissement[];
    }

    private getEtablissementProviders() {
        return Object.values(providers).filter(this.isEtablissementProvider) as EtablissementProvider[];
    }

    private isEtablissementProvider(data: unknown): data is EtablissementProvider {
        return (data as EtablissementProvider).isEtablissementProvider;
    }
}

const etablissementService = new EtablissementsService();

export default etablissementService;