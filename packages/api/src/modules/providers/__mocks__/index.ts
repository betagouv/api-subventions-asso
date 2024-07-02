import { IncomingMessage } from "http";
import { Socket } from "node:net";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { ProviderRequestService } from "../../provider-request/providerRequest.service";
import {
    applicationProvidersFixtures,
    fullGrantProvidersFixtures,
    grantProvidersFixtures,
    paymentProvidersFixtures,
} from "../__fixtures__/providers.fixture";

const providers = {
    // RAW service AssociationProvider + DemandeSubventionProvider
    serviceA: {
        provider: {
            name: "serviceA",
            id: "prov-A",
            type: ProviderEnum.raw,
            description: "descriptionA",
        },
        isAssociationsProvider: true,
        isDemandesSubventionsProvider: true,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}],
        getDemandeSubventionBySiret: async () => [{}],
        getDemandeSubventionBySiren: async () => [{}],
        http: new ProviderRequestService("prov-A"),
    },
    // API service AssociationProvider + DemandeSubventionProvider
    serviceB: {
        provider: {
            name: "serviceB",
            id: "prov-B",
            type: ProviderEnum.api,
            description: "descriptionB",
        },
        isAssociationsProvider: true,
        isDemandesSubventionsProvider: true,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}],
        getDemandeSubventionBySiret: async () => [{}],
        getDemandeSubventionBySiren: async () => [{}],
    },
    // API service AssociationProvider that returns null for all getAssociations()
    serviceC: {
        provider: {
            name: "serviceC",
            id: "prov-C",
            type: ProviderEnum.api,
            description: "descriptionC",
        },
        isAssociationsProvider: true,
        isDemandesSubventionsProvider: false,
        getAssociationsBySiren: async () => null,
        getAssociationsBySiret: async () => null,
        getAssociationsByRna: async () => null,
    },
    // API service that is not either an AssociationProvider or DemandesSubventionsProvider
    serviceD: {
        provider: {
            name: "serviceD",
            id: "prov-D",
            type: ProviderEnum.api,
            description: "descriptionD",
        },
        isAssociationsProvider: false,
        isDemandesSubventionsProvider: false,
        getAssociationsBySiren: async () => [{}],
        getAssociationsBySiret: async () => [{}],
        getAssociationsByRna: async () => [{}],
    },
    // RAW sercice that is not either an AssociationProvider or DemandesSubventionsProvider
    serviceE: {
        provider: {
            name: "serviceE",
            id: "prov-E",
            type: ProviderEnum.raw,
            description: "descriptionE with getSpecificDocumentStream",
        },
        isAssociationsProvider: false,
        isDemandesSubventionsProvider: false,
        getAssociationsBySiren: async () => [{}],
        getAssociationsBySiret: async () => [{}],
        getAssociationsByRna: async () => [{}],
        getSpecificDocumentStream: async (_path: string) => new IncomingMessage(new Socket()),
    },
};

export default providers;

export const fullGrantProviders = fullGrantProvidersFixtures;
export const demandesSubventionsProviders = applicationProvidersFixtures;
export const paymentProviders = paymentProvidersFixtures;
export const grantProviders = grantProvidersFixtures;
