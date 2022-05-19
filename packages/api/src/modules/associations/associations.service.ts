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
import etablissementService from '../etablissements/etablissements.service';
import rnaSirenService from '../open-data/rna-siren/rnaSiren.service';
import { NotFoundError } from '../../shared/errors/httpErrors/NotFoundError';
import { BadRequestError } from '../../shared/errors/httpErrors/BadRequestError';

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

    async getAssociationBySiren(siren: Siren) {
        const data = await (await this.aggregateSiren(siren)).filter(asso => asso) as Association[];

        if (!data.length) return null;

        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown" 
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }
    
    async getAssociationBySiret(siret: Siret) {
        const data = await (await this.aggregateSiret(siret)).filter(asso => asso) as Association[];
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

    async getEtablissements(identifier: AssociationIdentifiers) {
        const type = IdentifierHelper.getIdentifierType(identifier) ;
        if (!type || type === StructureIdentifiersEnum.siret) throw new Error("You must provide a valid SIREN or RNA");

        if(type === StructureIdentifiersEnum.rna) {
            const siren = await rnaSirenService.getSiren(identifier);

            if (!siren) return [];

            identifier = siren;
        }

        return await etablissementService.getEtablissementsBySiren(identifier) || [];
    }

    async getEtablissement(identifier: AssociationIdentifiers, nic: string) {
        const type = IdentifierHelper.getIdentifierType(identifier);

        if (!type || type === StructureIdentifiersEnum.siret) throw new BadRequestError("You must provide a valid SIREN or RNA");

        if(type === StructureIdentifiersEnum.rna) {
            const siren = await rnaSirenService.getSiren(identifier);

            if (!siren) throw new NotFoundError(`We dont have found a siren corresponding to rna ${identifier}`);

            identifier = siren;
        }

        return await etablissementService.getEtablissement(identifier + nic) || (() => { throw new NotFoundError("Etablissement not found") })();
    }

    private async aggregateSiren(siren: Siren): Promise<(Association | null)[]> {
        const associationProviders = this.getAssociationProviders();

        const promises = associationProviders.map(async provider => { 
            const assos = await provider.getAssociationsBySiren(siren);
            if (assos) return assos.flat();
            else return null;
        });
        return (await Promise.all(promises)).flat();
    }

    private async aggregateSiret(siret: Siret): Promise<(Association | null)[]> {
        const associationProviders = this.getAssociationProviders();

        const promises = associationProviders.map(async provider => { 
            const assos = await provider.getAssociationsBySiret(siret);
            if (assos) return assos.flat();
            else return null;
        });
        return (await Promise.all(promises)).flat();
    }

    private async aggregateRna(rna: Rna): Promise<(Association | null)[]> {
        const associationProviders = this.getAssociationProviders();

        const promises = associationProviders.map(async provider => { 
            const assos = await provider.getAssociationsByRna(rna);
            if (assos) return assos.flat();
            else return null;
        });
        return (await Promise.all(promises)).flat();
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