import { AssociationIdentifiers, DefaultObject, ProviderValues } from "../../@types";
import { Siret, Rna, Siren } from "@api-subventions-asso/dto";
import Association from "./@types/Association";
import AssociationsProvider from "./@types/AssociationsProvider";
import providers from "../providers";
import EntrepriseDtoAdapter from "../providers/dataEntreprise/adapters/EntrepriseDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";
import AssociationDtoAdapter from "../providers/dataEntreprise/adapters/AssociationDtoAdapter";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import demandesSubventionsService from '../demandes_subventions/demandes_subventions.service';

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

    async getAssociationBySiret(siret: Siret, rna?: Rna) {
        const data = await (await this.aggregateSiret(siret, rna)).filter(asso => asso) as Association[];
        if (!data.length) return null;

        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    async getAssociationByRna(rna: Rna) {
        const data = await (await this.aggregateRna(rna)).filter(asso => asso) as Association[];

        if (!data.length) return null;

        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    async getSubventions(identifier: AssociationIdentifiers) {
        return await demandesSubventionsService.getByAssociation(identifier);
    }


    private async aggregateSiren(siren: Siren, rna?: Rna): Promise<(Association | null)[]> {
        const associationProviders = this.getAssociationProviders();

        return await associationProviders.reduce(async (acc, provider) => {
            const result = await acc;
            const assos = await provider.getAssociationsBySiren(siren, rna);
            if (assos) {
                result.push(...assos.flat());
            }

            return result;
        }, Promise.resolve([]) as Promise<Association[]>);
    }

    private async aggregateSiret(siret: Siret, rna?: Rna): Promise<(Association | null)[]> {
        const associationProviders = this.getAssociationProviders();

        return await associationProviders.reduce(async (acc, provider) => {
            const result = await acc;
            const assos = await provider.getAssociationsBySiret(siret, rna);
            if (assos) {
                result.push(...assos.flat());
            }

            return result;
        }, Promise.resolve([]) as Promise<Association[]>);
    }


    private async aggregateRna(rna: Rna): Promise<(Association | null)[]> {
        const associationProviders = this.getAssociationProviders();

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

    private getAssociationProviders() {
        return Object.values(providers).filter((p) => this.isAssociationsProvider(p)) as AssociationsProvider[];
    }

}

const associationsService = new AssociationsService();

export default associationsService;