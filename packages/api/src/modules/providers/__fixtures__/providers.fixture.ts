import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { FullGrantProvider } from "../../grant/@types/FullGrantProvider";
import PaymentProvider from "../../payments/@types/PaymentProvider";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";

const mockApplicationProvider = service => ({
    ...service,
    isDemandesSubventionsProvider: true,
    rawToApplication: jest.fn(),
    getDemandeSubvention: jest.fn().mockResolvedValue([]),
});

const mockFullGrantProvider = service => ({
    ...service,
    isFullGrantProvider: true,
    rawToGrant: jest.fn().mockResolvedValue([]),
});

const mockPaymentProvider = service => ({
    ...service,
    isPaymentProvider: true,
    rawToPayment: jest.fn(),
    getPayments: jest.fn().mockResolvedValue([]),
});

const mockGrantProvider = provider => ({
    provider,
    isGrantProvider: true,
    getRawGrants: jest.fn().mockResolvedValue([]),
});

export const fullGrantProvidersFixtures: FullGrantProvider<unknown>[] = [
    mockFullGrantProvider({
        meta: {
            id: "provider-fullgrant-1",
            name: "PROVIDER_FULLGRANT_1",
            description: "API PROVIDER",
            type: ProviderEnum.api,
        },
    }),
    mockFullGrantProvider({
        meta: {
            id: "provider-fullgrant-2",
            name: "PROVIDER_FULLGRANT_2",
            description: "RAW PROVIDER",
            type: ProviderEnum.raw,
        },
    }),
];

export const applicationProvidersFixtures: DemandesSubventionsProvider<unknown>[] = [
    mockApplicationProvider({
        meta: {
            id: "provider-application-1",
            name: "PROVIDER_APPLICATION_1",
            description: "API PROVIDER",
            type: ProviderEnum.api,
        },
    }),
    mockApplicationProvider({
        meta: {
            id: "provider-application-2",
            name: "PROVIDER_APPLICATION_2",
            description: "RAW PROVIDER",
            type: ProviderEnum.raw,
        },
    }),
];

export const paymentProvidersFixtures: PaymentProvider<unknown>[] = [
    mockPaymentProvider({
        meta: {
            id: "provider-payment-1",
            name: "PROVIDER_PAYMENT_1",
            description: "RAW PROVIDER",
            type: ProviderEnum.raw,
        },
    }),
    mockPaymentProvider({
        meta: {
            id: "provider-payment-2",
            name: "PROVIDER_PAYMENT_2",
            description: "RAW PROVIDER",
            type: ProviderEnum.raw,
        },
    }),
];

export const grantProvidersFixtures = [
    ...fullGrantProvidersFixtures,
    ...applicationProvidersFixtures,
    ...paymentProvidersFixtures,
].map(mockGrantProvider);
