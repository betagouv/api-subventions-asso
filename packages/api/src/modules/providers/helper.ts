import { ApplicationStatus } from "@api-subventions-asso/dto";

export function toStatusFactory(statusMap: { [K in ApplicationStatus]?: string[] }) {
    function toStatus(providerStatus: string): ApplicationStatus {
        for (const [normalizedStatus, providerStatusList] of Object.entries(statusMap)) {
            if (providerStatusList.includes(providerStatus)) return normalizedStatus as ApplicationStatus;
        }
        return ApplicationStatus.UNKNWON;
    }

    return toStatus;
}
