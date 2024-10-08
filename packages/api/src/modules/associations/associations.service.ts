import { ProviderValues, Association, Siret, Rna, Siren, AssociationIdentifiers, StructureIdentifiers } from "dto";

import * as Sentry from "@sentry/node";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { DefaultObject } from "../../@types";

import providers from "../providers";
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";

import FormaterHelper from "../../shared/helpers/FormaterHelper";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import { capitalizeFirstLetter } from "../../shared/helpers/StringHelper";
import StructureIdentifiersError from "../../shared/errors/StructureIdentifierError";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";

import documentsService from "../documents/documents.service";
import paymentService from "../payments/payments.service";
import subventionsService from "../subventions/subventions.service";
import etablissementService from "../etablissements/etablissements.service";
import { NotFoundError } from "../../shared/errors/httpErrors";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import uniteLegalEntreprisesService from "../providers/uniteLegalEntreprises/uniteLegal.entreprises.service";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../shared/LegalCategoriesAccepted";
import AssociationsProvider from "./@types/AssociationsProvider";

export class AssociationsService {
    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [ApiAssoDtoAdapter.providerNameRna]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [LeCompteAssoRequestAdapter.PROVIDER_NAME]: 0.5,
    };

    /**
     *
     * ASSOCIATION INFO
     *
     */

    async getAssociation(id: StructureIdentifiers): Promise<Association> {
        const type = IdentifierHelper.getIdentifierType(id);
        let association;

        switch (type) {
            case StructureIdentifiersEnum.rna:
                association = await this.getAssociationByRna(id);
                break;
            case StructureIdentifiersEnum.siren:
                association = await this.getAssociationBySiren(id);
                break;
            case StructureIdentifiersEnum.siret:
                association = await this.getAssociationBySiret(id);
                break;
            default:
                throw new StructureIdentifiersError();
        }
        return association;
    }

    async getAssociationBySiren(siren: Siren) {
        const data = await this.aggregate(siren);
        if (!data.length) throw new NotFoundError("Association not found");
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    async getAssociationBySiret(siret: Siret) {
        const data = await this.aggregate(siret);
        if (!data.length) throw new NotFoundError("Association not found");
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    async getAssociationByRna(rna: Rna) {
        const rnaSirenEntities = await rnaSirenService.find(rna);
        if (rnaSirenEntities?.length) {
            try {
                const association = await this.getAssociationBySiren(rnaSirenEntities[0].siren);
                return association;
            } catch {
                // if no association found by siren search by rna
            }
        }

        const data = await this.aggregate(rna);
        if (!data.length) throw new NotFoundError("Association not found");
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    private async aggregate(id: StructureIdentifiers) {
        const idType = IdentifierHelper.getIdentifierType(id);
        if (!idType) throw new StructureIdentifiersError();
        const associationProviders = this.getAssociationProviders();
        const capitalizedId = capitalizeFirstLetter(idType) as "Rna" | "Siren" | "Siret";
        const promises = associationProviders.map(async provider => {
            try {
                const assos = await provider[`getAssociationsBy${capitalizedId}`](id);
                if (assos) return assos;
            } catch (e) {
                Sentry.captureException(e);
                console.error(provider, e);
            }
            return null;
        });
        return (await Promise.all(promises)).flat().filter(asso => asso) as Association[];
    }

    public isAssociationsProvider(provider: unknown): provider is AssociationsProvider {
        return (provider as AssociationsProvider).isAssociationsProvider;
    }

    private getAssociationProviders() {
        return Object.values(providers).filter(p => this.isAssociationsProvider(p)) as AssociationsProvider[];
    }

    async isSirenFromAsso(siren: Siren): Promise<boolean> {
        if (await uniteLegalEntreprisesService.isEntreprise(siren)) return false;

        // what follows will be useless when #554 is done (then maybe the helper will be redundant)
        if (await rnaSirenService.find(siren)) return true;

        const asso = await apiAssoService.findAssociationBySiren(siren);
        if (!asso?.categorie_juridique?.[0]?.value) return false;
        return LEGAL_CATEGORIES_ACCEPTED.includes(asso.categorie_juridique[0].value);
    }

    /**
     * ESTABLISHMENTS INFO
     */

    async getEstablishments(identifier: AssociationIdentifiers) {
        const type = IdentifierHelper.getIdentifierType(identifier);

        if (!type || type === StructureIdentifiersEnum.siret) {
            throw new Error("You must provide a valid SIREN or RNA");
        }
        if (type === StructureIdentifiersEnum.rna) {
            const rnaSirenEntities = await rnaSirenService.find(identifier);
            if (!rnaSirenEntities?.length) return [];

            identifier = rnaSirenEntities[0].siren;
        }
        return await etablissementService.getEtablissementsBySiren(identifier);
    }

    /**
     *
     * GRANTS, APPLICATIONS AND PAYMENTS INFO
     *
     */

    getSubventions(identifier: AssociationIdentifiers) {
        return subventionsService.getDemandesByAssociation(identifier);
    }

    getPayments(identifier: AssociationIdentifiers) {
        return paymentService.getPaymentsByAssociation(identifier);
    }

    /**
     *
     * DOCUMENTS INFO
     *
     */

    async getDocuments(identifier: AssociationIdentifiers) {
        const type = IdentifierHelper.getIdentifierType(identifier);
        if (type === StructureIdentifiersEnum.rna) return documentsService.getDocumentByRna(identifier);
        if (type === StructureIdentifiersEnum.siren) return documentsService.getDocumentBySiren(identifier);

        throw new AssociationIdentifierError();
    }
}

const associationsService = new AssociationsService();

export default associationsService;
