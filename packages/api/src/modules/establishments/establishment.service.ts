import { ProviderValues, Establishment } from "dto";

import * as Sentry from "@sentry/node";
import { NotFoundError } from "core";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import { DefaultObject } from "../../@types";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import providers from "../providers";
import FonjepEntityAdapter from "../providers/fonjep/adapters/FonjepEntityAdapter";
import subventionsService from "../subventions/subventions.service";
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";
import grantService from "../grant/grant.service";
import paymentService from "../payments/payments.service";
import documentsService from "../documents/documents.service";
import ApiEntrepriseAdapter from "../providers/apiEntreprise/adapters/ApiEntrepriseAdapter";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import { EstablishmentAdapter } from "./EstablishmentAdapter";
import EstablishmentProvider from "./@types/EstablishmentProvider";
import { StructureIdentifier } from "../../identifierObjects/@types/StructureIdentifier";

export class EstablishmentService {
    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [ApiEntrepriseAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [FonjepEntityAdapter.PROVIDER_NAME]: 0.5,
    };

    async getEstablishment(identifier: EstablishmentIdentifier) {
        const data = await this.aggregate(identifier);
        if (!data.length) {
            throw new NotFoundError("Establishment not found");
        }
        return FormaterHelper.formatData(
            // force TS typing because Establishment[] is DefaultObject<ProviderValues>[]
            data as unknown as DefaultObject<ProviderValues>[],
            this.provider_score,
        ) as unknown as Establishment;
    }

    async getEstablishments(identifier: AssociationIdentifier) {
        const data = await this.aggregate(identifier);

        if (!data.length) throw new NotFoundError();

        const groupBySiret = data.reduce(
            (acc, establishment) => {
                const siret = establishment.siret[0].value;

                if (!siret) return acc;

                if (!acc[siret]) acc[siret] = [];
                acc[siret].push(establishment);

                return acc;
            },
            {} as DefaultObject<Establishment[]>,
        );
        const establishments = Object.values(groupBySiret).map(
            establishment =>
                // @ts-expect-error: transform DefaultObject to Establishment
                FormaterHelper.formatData(
                    // @ts-expect-error: transform Establishment[] to DefaultObject<ProviderValues>[]
                    establishment as DefaultObject<ProviderValues>[],
                    this.provider_score,
                ) as Establishment,
        );

        const sortEstablishmentsByStatus = (establishmentA: Establishment, establishmentB: Establishment) =>
            this.scoreEstablishment(establishmentB) - this.scoreEstablishment(establishmentA);
        const sortedEstablishment = establishments.sort(sortEstablishmentsByStatus); // The order is the "siege" first, the secondary is open, the third is closed.
        return sortedEstablishment.map(establishment => EstablishmentAdapter.toSimplifiedEstablishment(establishment));
    }

    getGrants(id: EstablishmentIdentifier) {
        return grantService.getGrants(id);
    }

    async getSubventions(id: EstablishmentIdentifier) {
        return (await subventionsService.getDemandes(id)).flat().filter(subvention => subvention);
    }

    async getPayments(id: EstablishmentIdentifier) {
        return await paymentService.getPayments(id);
    }

    async getDocuments(id: EstablishmentIdentifier) {
        return await documentsService.getDocuments(id);
    }

    getRibs(id: EstablishmentIdentifier) {
        return documentsService.getRibs(id);
    }

    private async aggregate(id: StructureIdentifier) {
        const establishmentProviders = this.getEstablishmentProviders();

        const promises = establishmentProviders.map(provider => {
            try {
                return provider.getEstablishments(id);
            } catch (e) {
                Sentry.captureException(e);
                console.error(provider, e);
                return Promise.resolve([]);
            }
        });
        return (await Promise.all(promises)).flat(2);
    }

    private getEstablishmentProviders() {
        return Object.values(providers).filter(this.isEstablishmentProvider);
    }

    private isEstablishmentProvider(data: unknown): data is EstablishmentProvider {
        return (data as EstablishmentProvider).isEstablishmentProvider;
    }

    private scoreEstablishment(establishment: Establishment) {
        let score = 0;

        if (establishment.ouvert && establishment.ouvert[0].value) score += 1;
        if (establishment.siege && establishment.siege[0].value) score += 10;
        return score;
    }
}

const establishmentService = new EstablishmentService();

export default establishmentService;
