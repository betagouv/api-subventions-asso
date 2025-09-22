import { ProviderEnum } from "../../../@enums/ProviderEnum";
import PaymentProvider from "../../payments/@types/PaymentProvider";
import ApplicationProvider from "../../subventions/@types/ApplicationProvider";

const mockApplicationProvider = service => ({
    ...service,
    isApplicationProvider: true,
    rawToApplication: jest.fn(),
    getApplication: jest.fn().mockResolvedValue([]),
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

export const applicationProvidersFixtures: ApplicationProvider<unknown>[] = [
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

export const grantProvidersFixtures = [...applicationProvidersFixtures, ...paymentProvidersFixtures].map(
    mockGrantProvider,
);
