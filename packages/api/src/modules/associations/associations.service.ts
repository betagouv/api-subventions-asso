import { ProviderValues, Association } from "dto";

import * as Sentry from "@sentry/node";
import { NotFoundError } from "core";
import { DefaultObject } from "../../@types";

import providers from "../providers";
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";

import FormaterHelper from "../../shared/helpers/FormaterHelper";

import documentsService from "../documents/documents.service";
import paymentService from "../payments/payments.service";
import subventionsService from "../subventions/subventions.service";
import etablissementService from "../etablissements/etablissements.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import uniteLegalEntreprisesService from "../providers/uniteLegalEntreprises/uniteLegal.entreprises.service";
import apiAssoService from "../providers/apiAsso/apiAsso.service";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../shared/LegalCategoriesAccepted";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import Siren from "../../identifierObjects/Siren";
import AssociationsProvider from "./@types/AssociationsProvider";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";

export class AssociationsService {
    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [ApiAssoDtoAdapter.providerNameRna]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
    };

    async getAssociation(associationIdentifier: AssociationIdentifier): Promise<Association> {
        const data = await this.aggregate(associationIdentifier);
        if (!data.length) throw new NotFoundError("Association not found");
        return FormaterHelper.formatData(data as DefaultObject<ProviderValues>[], this.provider_score) as Association;
    }

    getEtablissements(identifier: AssociationIdentifier) {
        return etablissementService.getEtablissements(identifier);
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
    /*
     * eventually should be used to filter chorus as well
     * */
    async isIdentifierFromAsso(id: StructureIdentifier): Promise<boolean> {
        let siren: Siren;
        if (id instanceof AssociationIdentifier) {
            if (id.rna) return true;
            if (id.siren) siren = id.siren;
            else return false;
        } else if (id.siret) {
            siren = id.siret.toSiren();
        } else {
            return false;
        }

        if (await uniteLegalEntreprisesService.isEntreprise(siren)) return false;
        // what follows will be useless when #554 is done (then maybe the helper will be redundant)
        if (await rnaSirenService.find(siren)) return true;

        const asso = await apiAssoService.findAssociationBySiren(siren);
        return this.isCategoryFromAsso(asso?.categorie_juridique?.[0]?.value);
    }

    isCategoryFromAsso(category: string | undefined): boolean {
        if (!category) return false;
        return LEGAL_CATEGORIES_ACCEPTED.includes(category);
    }

    /**
     * ESTABLISHMENTS INFO
     */

    getEstablishments(identifier: AssociationIdentifier) {
        return etablissementService.getEtablissements(identifier);
    }

    /**
     *
     * GRANTS, APPLICATIONS AND PAYMENTS INFO
     *
     */

    getSubventions(identifier: AssociationIdentifier) {
        return subventionsService.getDemandes(identifier);
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
