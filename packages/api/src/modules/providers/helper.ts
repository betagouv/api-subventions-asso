import { ApplicationStatus } from "dto";
import DemandesSubventionsProvider from "../subventions/@types/DemandesSubventionsProvider";
import PaymentProvider from "../payments/@types/PaymentProvider";
import { FullGrantProvider } from "../grant/@types/FullGrantProvider";
import providers from ".";

export function toStatusFactory(statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[]) {
    if (!Array.isArray(statusConversionArray)) return () => ApplicationStatus.UNKNWON;

    function toStatus(providerStatus: string): ApplicationStatus {
        return (
            statusConversionArray.find(({ providerStatusList }) => providerStatusList.includes(providerStatus))
                ?.label || ApplicationStatus.UNKNWON
        );
    }

    return toStatus;
}

export function getDemandesSubventionsProviders() {
    return Object.values(providers).filter(
        p => (p as DemandesSubventionsProvider<unknown>).isDemandesSubventionsProvider,
    ) as DemandesSubventionsProvider<unknown>[];
}

export function getPaymentProviders() {
    return Object.values(providers).filter(
        p => (p as PaymentProvider<unknown>).isPaymentProvider,
    ) as PaymentProvider<unknown>[];
}

export function getFullGrantProviders() {
    return Object.values(providers).filter(
        p => (p as FullGrantProvider<unknown, unknown>).isFullGrantProvider,
    ) as FullGrantProvider<unknown, unknown>[];
}
