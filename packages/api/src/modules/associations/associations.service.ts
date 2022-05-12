import { ProviderValues, Association, Siret, Rna, Siren } from '@api-subventions-asso/dto';
import { AssociationIdentifiers, DefaultObject, StructureIdentifiers } from "../../@types";
import AssociationsProvider from "./@types/AssociationsProvider";
import providers from "../providers";
import EntrepriseDtoAdapter from "../providers/dataEntreprise/adapters/EntrepriseDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";
import AssociationDtoAdapter from "../providers/dataEntreprise/adapters/AssociationDtoAdapter";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";
import subventionsService from '../subventions/subventions.service';
import * as IdentifierHelper from '../../shared/helpers/IdentifierHelper';
import { StructureIdentifiersEnum } from '../../@enums/StructureIdentifiersEnum';

export class AssociationsService {

    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [ApiAssoDtoAdapter.providerNameRna]: 1,
        [EntrepriseDtoAdapter.PROVIDER_NAME]: 1,
        [AssociationDtoAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [LeCompteAssoRequestAdapter.PROVIDER_NAME]: 0.5,
    }

    async getAssociation(id: StructureIdentifiers): Promise<Association | null> {
        const type = IdentifierHelper.getIdentifierType(id);
        if (type === StructureIdentifiersEnum.rna) return await this.getAssociationByRna(id);
        if (type === StructureIdentifiersEnum.siren) return await this.getAssociationBySiren(id);
        if (type === StructureIdentifiersEnum.siret) return await this.getAssociationBySiret(id);
        throw new Error("You must give a valid RNA, SIREN or SIRET number.");
    }

    async getAssociationBySiren(siren: Siren, rna?: Rna) {
        const data = await (await this.aggregateSiren(siren, rna)).filter(asso => asso) as Association[];

        if (!data.length) return null;

        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown" 
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }
    
    async getAssociationBySiret(siret: Siret, rna?: Rna) {
        const data = await (await this.aggregateSiret(siret, rna)).filter(asso => asso) as Association[];
        if (!data.length) return null;
        
        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown" 
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }
    
    async getAssociationByRna(rna: Rna) {
        const data = await (await this.aggregateRna(rna)).filter(asso => asso) as Association[];
        
        if (!data.length) return null;
        
        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown" 
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    async getSubventions(identifier: AssociationIdentifiers) {
        return await subventionsService.getDemandesByAssociation(identifier);
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

    public isAssociationsProvider(provider: unknown): provider is AssociationsProvider {
        return (provider as AssociationsProvider).isAssociationsProvider
    }

    private getAssociationProviders() {
        return Object.values(providers).filter((p) => this.isAssociationsProvider(p)) as AssociationsProvider[];
    }

}

const associationsService = new AssociationsService();

export default associationsService;