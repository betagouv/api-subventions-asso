import { IncomingMessage } from "http";
import { Socket } from "node:net";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { ProviderRequestService } from "../../provider-request/providerRequest.service";
import {
    applicationProvidersFixtures,
    grantProvidersFixtures,
    paymentProvidersFixtures,
} from "../__fixtures__/providers.fixture";

const providers = {
    // RAW service AssociationProvider + DemandeSubventionProvider
    serviceA: {
        meta: {
            name: "serviceA",
            id: "prov-A",
            type: ProviderEnum.raw,
            description: "descriptionA",
        },
        isAssociationsProvider: true,
        isApplicationProvider: true,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}],
        getDemandeSubventionBySiret: async () => [{}],
        getDemandeSubventionBySiren: async () => [{}],
        http: new ProviderRequestService("prov-A"),
    },
    // API service AssociationProvider + DemandeSubventionProvider
    serviceB: {
        meta: {
            name: "serviceB",
            id: "prov-B",
            type: ProviderEnum.api,
            description: "descriptionB",
        },
        isAssociationsProvider: true,
        isApplicationProvider: true,
        getAssociationsBySiren: () => [{}],
        getAssociationsBySiret: () => [{}],
        getAssociationsByRna: () => [{}],
        getDemandeSubventionBySiret: async () => [{}],
        getDemandeSubventionBySiren: async () => [{}],
    },
    // API service AssociationProvider that returns null for all getAssociations()
    serviceC: {
        meta: {
            name: "serviceC",
            id: "prov-C",
            type: ProviderEnum.api,
            description: "descriptionC",
        },
        isAssociationsProvider: true,
        isApplicationProvider: false,
        getAssociationsBySiren: async () => null,
        getAssociationsBySiret: async () => null,
        getAssociationsByRna: async () => null,
    },
    // API service that is not either an AssociationProvider or ApplicationProvider
    serviceD: {
        meta: {
            name: "serviceD",
            id: "prov-D",
            type: ProviderEnum.api,
            description: "descriptionD",
        },
        isAssociationsProvider: false,
        isApplicationProvider: false,
        getAssociationsBySiren: async () => [{}],
        getAssociationsBySiret: async () => [{}],
        getAssociationsByRna: async () => [{}],
    },
    // RAW sercice that is not either an AssociationProvider or ApplicationProvider
    serviceE: {
        meta: {
            name: "serviceE",
            id: "prov-E",
            type: ProviderEnum.raw,
            description: "descriptionE with getSpecificDocumentStream",
        },
        isAssociationsProvider: false,
        isApplicationProvider: false,
        getAssociationsBySiren: async () => [{}],
        getAssociationsBySiret: async () => [{}],
        getAssociationsByRna: async () => [{}],

        getSpecificDocumentStream: async (_path: string) => new IncomingMessage(new Socket()),
    },
};

export default providers;

export const applicationProviders = applicationProvidersFixtures;
export const paymentProviders = paymentProvidersFixtures;
export const grantProviders = grantProvidersFixtures;
