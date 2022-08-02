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
import versementsService from '../versements/versements.service';
import * as IdentifierHelper from '../../shared/helpers/IdentifierHelper';
import { StructureIdentifiersEnum } from '../../@enums/StructureIdentifiersEnum';
import etablissementService from '../etablissements/etablissements.service';
import rnaSirenService from '../open-data/rna-siren/rnaSiren.service';
import { NotFoundError } from '../../shared/errors/httpErrors/NotFoundError';
import { BadRequestError } from '../../shared/errors/httpErrors/BadRequestError';
import { capitalizeFirstLetter } from '../../shared/helpers/StringHelper';
import StructureIdentifiersError from '../../shared/errors/StructureIdentifierError';
import documentsService from '../documents/documents.service';
import AssociationIdentifierError from '../../shared/errors/AssociationIdentifierError';

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
        throw new StructureIdentifiersError();
    }

    async getAssociationBySiren(siren: Siren) {
        const data = await this.aggregate(siren);
        if (!data.length) return null;
        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown" 
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    async getAssociationBySiret(siret: Siret) {
        const data = await this.aggregate(siret);
        if (!data.length) return null;
        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown" 
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    async getAssociationByRna(rna: Rna) {
        const siren = await rnaSirenService.getSiren(rna);
        if (siren) return this.getAssociationBySiren(siren)

        const data = await this.aggregate(rna);
        if (!data.length) return null;
        // @ts-expect-error: TODO: I don't know how to handle this without using "as unknown" 
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }


    getSubventions(identifier: AssociationIdentifiers) {
        return subventionsService.getDemandesByAssociation(identifier);
    }

    async getVersements(identifier: AssociationIdentifiers) {
        return await versementsService.getVersementsByAssociation(identifier);
    }

    async getDocuments(identifier: AssociationIdentifiers) {
        const type = IdentifierHelper.getIdentifierType(identifier);
        if (type === StructureIdentifiersEnum.rna) return documentsService.getDocumentByRna(identifier);
        if (type === StructureIdentifiersEnum.siren) return documentsService.getDocumentBySiren(identifier);

        throw new AssociationIdentifierError();
    }

    async getEtablissements(identifier: AssociationIdentifiers) {
        const type = IdentifierHelper.getIdentifierType(identifier);
        if (!type || type === StructureIdentifiersEnum.siret) throw new Error("You must provide a valid SIREN or RNA");

        if (type === StructureIdentifiersEnum.rna) {
            const siren = await rnaSirenService.getSiren(identifier);

            if (!siren) return [];

            identifier = siren;
        }

        return await etablissementService.getEtablissementsBySiren(identifier) || [];
    }

    async getEtablissement(identifier: AssociationIdentifiers, nic: string) {
        const type = IdentifierHelper.getIdentifierType(identifier);

        if (!type || type === StructureIdentifiersEnum.siret) throw new BadRequestError("You must provide a valid SIREN or RNA");

        if (type === StructureIdentifiersEnum.rna) {
            const siren = await rnaSirenService.getSiren(identifier);

            if (!siren) throw new NotFoundError(`We haven't found a corresponding SIREN to the given RNA ${identifier}`);

            identifier = siren;
        }

        return await etablissementService.getEtablissement(identifier + nic) || (() => { throw new NotFoundError("Etablissement not found") })();
    }

    private async aggregate(id: StructureIdentifiers) {
        const idType = IdentifierHelper.getIdentifierType(id);
        if (!idType) throw new StructureIdentifiersError();
        const associationProviders = this.getAssociationProviders();
        const capitalizedId = capitalizeFirstLetter(idType) as "Rna" | "Siren" | "Siret";
        const promises = associationProviders.map(async provider => { 
            try{
                const assos = await provider[`getAssociationsBy${capitalizedId}`](id);
                if (assos) return assos;
            }  catch(e) {
                console.error(provider, e);
            }
            return null;
        });
        return (await Promise.all(promises)).flat().filter(asso => asso) as Association[];
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