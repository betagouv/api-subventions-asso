import { ProviderValues, Siren, Siret, Etablissement } from "dto";

import * as Sentry from "@sentry/node";
import LeCompteAssoRequestAdapter from "../providers/leCompteAsso/adapters/LeCompteAssoRequestAdapter";
import OsirisRequestAdapter from "../providers/osiris/adapters/OsirisRequestAdapter";
import { DefaultObject } from "../../@types";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import providers from "../providers";
import FonjepEntityAdapter from "../providers/fonjep/adapters/FonjepEntityAdapter";
import subventionsService from "../subventions/subventions.service";
import ApiAssoDtoAdapter from "../providers/apiAsso/adapters/ApiAssoDtoAdapter";
import { isSiren } from "../../shared/Validators";
import grantService from "../grant/grant.service";
import paymentService from "../payments/payments.service";
import documentsService from "../documents/documents.service";
import ApiEntrepriseAdapter from "../providers/apiEntreprise/adapters/ApiEntrepriseAdapter";
import { NotFoundError, BadRequestError } from "../../shared/errors/httpErrors";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { EtablissementAdapter } from "./EtablissementAdapter";
import EtablissementProvider from "./@types/EtablissementProvider";

export class EtablissementsService {
    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoAdapter.providerNameSiren]: 1,
        [ApiEntrepriseAdapter.PROVIDER_NAME]: 1,
        [OsirisRequestAdapter.PROVIDER_NAME]: 0.5,
        [LeCompteAssoRequestAdapter.PROVIDER_NAME]: 0.5,
        [FonjepEntityAdapter.PROVIDER_NAME]: 0.5,
    };

    async getEtablissement(siret: Siret) {
        const type = getIdentifierType(siret);
        if (!type || type !== StructureIdentifiersEnum.siret) {
            throw new BadRequestError("You must provide a valid SIRET");
        }
        const data = await this.aggregate(siret);
        if (!data.length) {
            throw new NotFoundError("Etablissement not found");
        }
        return FormaterHelper.formatData(
            // force TS typing because Etablissement[] is DefaultObject<ProviderValues>[]
            data as unknown as DefaultObject<ProviderValues>[],
            this.provider_score,
        ) as unknown as Etablissement;
    }

    async getEtablissementsBySiren(siren: Siren) {
        const data = await this.aggregate(siren);

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

    getGrants(siret: Siret) {
        return grantService.getGrants(siret);
    }

    getSubventions(siret: Siret) {
        return subventionsService.getDemandesByEtablissement(siret);
    }

    async getPayments(siret: Siret) {
        return await paymentService.getPaymentsBySiret(siret);
    }

    async getDocuments(siret: Siret) {
        return await documentsService.getDocumentBySiret(siret);
    }

    getRibs(siret: Siret) {
        return documentsService.getRibsBySiret(siret);
    }

    private async aggregate(id: Siren | Siret) {
        const getter = isSiren(id) ? "getEtablissementsBySiren" : "getEtablissementsBySiret";
        const etablisementProviders = this.getEtablissementProviders();

        const promises = etablisementProviders.map(async provider => {
            const etabs = await provider[getter](id, true).catch(e => {
                Sentry.captureException(e);
                console.error(provider, e);
                return null;
            });
            if (etabs) return etabs;
            else return null;
        });
        return (await Promise.all(promises))
            .flat()
            .flat()
            .filter(etablissement => etablissement) as Etablissement[];
    }

    private getEtablissementProviders() {
        return Object.values(providers).filter(this.isEtablissementProvider) as EtablissementProvider[];
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
