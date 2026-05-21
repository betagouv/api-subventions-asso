import requestsService from "$lib/services/requests.service";
import type { ApplicationFlatDto, OsirisActions } from "dto";

// Move this in DTO ?
export enum ProviderName {
    osiris = "osiris",
}

export type ProviderDetailsMap = {
    [ProviderName.osiris]: OsirisActions;
};

class GrantPort {
    async getApplicationProviderDetails(
        application: ApplicationFlatDto,
    ): Promise<ProviderDetailsMap[ProviderName] | null> {
        if (!(application.fournisseur in ProviderName)) return null;
        const path = `/subvention/details/${application.fournisseur}/${application.idSubventionProvider}`;
        const details = (await requestsService.get(path)).data?.details ?? null;
        return details;
    }
}

const grantPort = new GrantPort();
export default grantPort;
