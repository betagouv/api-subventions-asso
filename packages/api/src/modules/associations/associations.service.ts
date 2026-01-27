import { ProviderValues, Association } from "dto";

import * as Sentry from "@sentry/node";
import { NotFoundError } from "core";
import { DefaultObject } from "../../@types";

import providers from "../providers";
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";

import FormaterHelper from "../../shared/helpers/FormaterHelper";

import documentsService from "../documents/documents.service";
import paymentService from "../payments/payments.service";
import subventionsService from "../subventions/subventions.service";
import establishmentService from "../establishments/establishment.service";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import AssociationsProvider from "./@types/AssociationsProvider";

export class AssociationsService {
    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [ApiAssoDtoAdapter.providerNameRna]: 1,
    };

    async getAssociation(associationIdentifier: AssociationIdentifier): Promise<Association> {
        const data = await this.aggregate(associationIdentifier);
        if (!data.length) throw new NotFoundError("Association not found");
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    private async aggregate(associationIdentifier: AssociationIdentifier) {
        const associationProviders = this.getAssociationProviders();
        const promises = associationProviders.map(async provider => {
            try {
                const assos = await provider.getAssociations(associationIdentifier);
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

    /**
     * ESTABLISHMENTS INFO
     */

    getEstablishments(identifier: AssociationIdentifier) {
        return establishmentService.getEstablishments(identifier);
    }

    /**
     *
     * GRANTS, APPLICATIONS AND PAYMENTS INFO
     *
     */

    async getSubventions(identifier: AssociationIdentifier) {
        return (await subventionsService.getDemandes(identifier)).flat().filter(subvention => subvention);
    }

    getPayments(identifier: AssociationIdentifier) {
        return paymentService.getPayments(identifier);
    }

    /**
     *
     * DOCUMENTS INFO
     *
     */

    getDocuments(identifier: AssociationIdentifier) {
        return documentsService.getDocuments(identifier);
    }
}

const associationsService = new AssociationsService();

export default associationsService;
