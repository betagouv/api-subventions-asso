import { Siren, DefaultObject,  Rna, ProviderValues } from "../../@types";
import Association from "./interfaces/Association";
import AssociationsProvider from "./interfaces/AssociationsProvider";
import providers from "../providers";
import EntrepriseDtoAdapter from "../providers/dataEntreprise/adapters/EntrepriseDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";
import AssociationDtoAdapter from "../providers/dataEntreprise/adapters/AssociationDtoAdapter";
import FormaterHelper from "../../shared/helpers/FormaterHelper";

export class AssociationsService {

    private provider_score: DefaultObject<number> = {
        [EntrepriseDtoAdapter.PROVIDER_NAME]: 1,
        [AssociationDtoAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [LeCompteAssoRequestAdapter.PROVIDER_NAME]: 0.5,
    }

    async getAssociationBySiren(siren: Siren, rna?: Rna) {
        const data = await (await this.aggregateSiren(siren, rna)).filter(asso => asso) as Association[];

        if (!data.length) return null;

        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    async getAssociationByRna(rna: Rna) {
        const data = await (await this.aggregateRna(rna)).filter(asso => asso) as Association[];

        if (!data.length) return null;

        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }


    private async aggregateSiren(siren: Siren, rna?: Rna): Promise<(Association | null)[]> {
        const associationProviders = Object.values(providers).filter((p) => this.isAssociationsProvider(p)) as AssociationsProvider[];

        return await associationProviders.reduce(async (acc, provider) => {
            const result = await acc;
            const assos = await provider.getAssociationsBySiren(siren, rna);
            if (assos) {
                result.push(...assos.flat());
            }

            return result;
        }, Promise.resolve([]) as Promise<Association[]>);
    }

    private async aggregateRna(rna: Rna): Promise<(Association | null)[]> {
        const associationProviders = Object.values(providers).filter((p) => this.isAssociationsProvider(p)) as AssociationsProvider[];

        return await associationProviders.reduce(async (acc, provider) => {
            const result = await acc;
            const assos = await provider.getAssociationsByRna(rna);
            if (assos) {
                result.push(...assos.flat());
            }

            return result;
        }, Promise.resolve([]) as Promise<Association[]>);
    }

    private isAssociationsProvider(data: unknown): data is AssociationsProvider {
        return (data as AssociationsProvider).isAssociationsProvider
    }

}

const associationsService = new AssociationsService();

export default associationsService;