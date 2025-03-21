import { ProviderValues, Etablissement } from "dto";

import * as Sentry from "@sentry/node";
import { NotFoundError } from "core";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import { DefaultObject, StructureIdentifier } from "../../@types";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import providers from "../providers";
import FonjepEntityAdapter from "../providers/fonjep/adapters/FonjepEntityAdapter";
import subventionsService from "../subventions/subventions.service";
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";
import grantService from "../grant/grant.service";
import paymentService from "../payments/payments.service";
import documentsService from "../documents/documents.service";
import ApiEntrepriseAdapter from "../providers/apiEntreprise/adapters/ApiEntrepriseAdapter";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import { EtablissementAdapter } from "./EtablissementAdapter";
import EtablissementProvider from "./@types/EtablissementProvider";

export class EtablissementsService {
    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [ApiEntrepriseAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [FonjepEntityAdapter.PROVIDER_NAME]: 0.5,
    };

    async getEtablissement(identifier: EstablishmentIdentifier) {
        const data = await this.aggregate(identifier);
        if (!data.length) {
            throw new NotFoundError("Etablissement not found");
        }
        return FormaterHelper.formatData(
            // force TS typing because Etablissement[] is DefaultObject<ProviderValues>[]
            data as unknown as DefaultObject<ProviderValues>[],
            this.provider_score,
        ) as unknown as Etablissement;
    }

    async getEtablissements(identifier: AssociationIdentifier) {
        const data = await this.aggregate(identifier);

        if (!data.length) throw new NotFoundError();

        const groupBySiret = data.reduce((acc, etablissement) => {
            const siret = etablissement.siret[0].value;

            if (!siret) return acc;

            if (!acc[siret]) acc[siret] = [];
            acc[siret].push(etablissement);

            return acc;
        }, {} as DefaultObject<Etablissement[]>);
        const etablissements = Object.values(groupBySiret).map(
            etablissements =>
                // @ts-expect-error: transform DefaultObject to Etablissement
                FormaterHelper.formatData(
                    // @ts-expect-error: transform Etablissement[] to DefaultObject<ProviderValues>[]
                    etablissements as DefaultObject<ProviderValues>[],
                    this.provider_score,
                ) as Etablissement,
        );

        const sortEtablissmentsByStatus = (etablisementA: Etablissement, etablisementB: Etablissement) =>
            this.scoreEtablisement(etablisementB) - this.scoreEtablisement(etablisementA);
        const sortedEtablissement = etablissements.sort(sortEtablissmentsByStatus); // The order is the "siege" first, the secondary is open, the third is closed.
        return sortedEtablissement.map(etablissement => EtablissementAdapter.toSimplifiedEtablissement(etablissement));
    }

    getGrants(id: EstablishmentIdentifier) {
        return grantService.getGrants(id);
    }

    getSubventions(id: EstablishmentIdentifier) {
        return subventionsService.getDemandes(id);
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
        const etablisementProviders = this.getEtablissementProviders();

        const promises = etablisementProviders.map(provider => {
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

    private getEtablissementProviders() {
        return Object.values(providers).filter(this.isEtablissementProvider);
    }

    private isEtablissementProvider(data: unknown): data is EtablissementProvider {
        return (data as EtablissementProvider).isEtablissementProvider;
    }

    private scoreEtablisement(etablisement: Etablissement) {
        let score = 0;

        if (etablisement.ouvert && etablisement.ouvert[0].value) score += 1;
        if (etablisement.siege && etablisement.siege[0].value) score += 10;
        return score;
    }
}

const etablissementService = new EtablissementsService();

export default etablissementService;
