import { ProviderValues, EstablishmentWithProviderValues } from "dto";

import * as Sentry from "@sentry/node";
import { NotFoundError } from "core";
import OsirisMapper from "../providers/osiris/osiris.mapper";
import { DefaultObject } from "../../@types";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import providers from "../providers";
import FonjepEntityMapper from "../providers/fonjep/mappers/fonjep-entity.mapper";
import ApiAssoDtoMapper from "../providers/api-asso/mappers/api-asso.dto.mapper";
import grantService from "../grant/grant.service";
import paymentService from "../payments/payments.service";
import documentsService from "../documents/documents.service";
import ApiEntrepriseMapper from "../providers/api-entreprise/mappers/api-entreprise.mapper";
import EstablishmentIdentifier from "../../identifier-objects/EstablishmentIdentifier";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import { EstablishmentMapper } from "./establishment.mapper";
import EstablishmentProvider from "./@types/EstablishmentProvider";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import getSubventionsByIdentifier, {
    GetSubventionsByIdentifier,
} from "../application-flat/use-cases/get-subventions-by-identifier";

export class EstablishmentService {
    constructor(private getSubventions: GetSubventionsByIdentifier) {}
    private provider_score: DefaultObject<number> = {
        [ApiAssoDtoMapper.providerNameSiren]: 1,
        [ApiEntrepriseMapper.PROVIDER_NAME]: 1,
        [OsirisMapper.PROVIDER_NAME]: 0.5,
        [FonjepEntityMapper.PROVIDER_NAME]: 0.5,
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
        ) as unknown as EstablishmentWithProviderValues;
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
            {} as DefaultObject<EstablishmentWithProviderValues[]>,
        );
        const establishments = Object.values(groupBySiret).map(
            establishment =>
                // @ts-expect-error: transform DefaultObject to Establishment
                FormaterHelper.formatData(
                    // @ts-expect-error: transform Establishment[] to DefaultObject<ProviderValues>[]
                    establishment as DefaultObject<ProviderValues>[],
                    this.provider_score,
                ) as EstablishmentWithProviderValues,
        );

        const sortEstablishmentsByStatus = (
            establishmentA: EstablishmentWithProviderValues,
            establishmentB: EstablishmentWithProviderValues,
        ) => this.scoreEstablishment(establishmentB) - this.scoreEstablishment(establishmentA);
        const sortedEstablishment = establishments.sort(sortEstablishmentsByStatus); // The order is the "siege" first, the secondary is open, the third is closed.
        return sortedEstablishment.map(establishment => EstablishmentMapper.toSimplifiedEstablishment(establishment));
    }

    getOldGrants(id: EstablishmentIdentifier) {
        return grantService.getOldGrants(id);
    }

    async getDemandes(id: EstablishmentIdentifier) {
        return this.getSubventions.execute(id);
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
                return provider.getEstablishmentsWithProviderValues(id);
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

    private scoreEstablishment(establishment: EstablishmentWithProviderValues) {
        let score = 0;

        if (establishment.ouvert && establishment.ouvert[0].value) score += 1;
        if (establishment.siege && establishment.siege[0].value) score += 10;
        return score;
    }
}

const establishmentService = new EstablishmentService(getSubventionsByIdentifier);

export default establishmentService;
