import { ApplicationStatus } from "@api-subventions-asso/dto";

export function toStatusFactory(statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[]) {
    function toStatus(providerStatus: string): ApplicationStatus {
        if (!statusConversionArray) return ApplicationStatus.UNKNWON;
        return (
            statusConversionArray.find(({ providerStatusList }) => providerStatusList.includes(providerStatus))
                ?.label || ApplicationStatus.UNKNWON
        );
    }

    return toStatus;
}
