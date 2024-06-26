import { ApplicationStatus } from "dto";

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
