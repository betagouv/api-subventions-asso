// import requestsService from "$lib/services/requests.service";
import type { ApplicationFlatDto, OsirisActions } from "dto";

// Move this in DTO ?
export enum ProviderName {
    osiris = "osiris",
}

export type ProviderDetailsMap = {
    [ProviderName.osiris]: OsirisActions;
};

class GrantPort {
    async getApplicationProviderDetails(application: ApplicationFlatDto): Promise<ProviderDetailsMap[ProviderName]> {
        const path = `/grants/details/${application.fournisseur}/${application.idSubventionProvider}`;
        // const details = (await requestsService.get(path)).data || null;
        // if (!details) return details;
        const details = {
            actions: [
                {
                    intitule: "Action 1",
                    description:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt rhoncus blandit. Proin quis augue quis justo consectetur gravida ac nec nulla. Donec tincidunt mollis sagittis. Sed commodo bibendum lectus, vehicula sollicitudin mi ullamcorper a. Pellentesque laoreet velit vitae imperdiet posuere. Quisque quis pellentesque quam, sit amet dapibus augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed ante lectus, malesuada at nisi sed, mattis malesuada tellus. Morbi elementum nisl et pretium dictum. ",
                },
                {
                    intitule: "Action 2",
                    description:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt rhoncus blandit. Proin quis augue quis justo consectetur gravida ac nec nulla. Donec tincidunt mollis sagittis. Sed commodo bibendum lectus, vehicula sollicitudin mi ullamcorper a. Pellentesque laoreet velit vitae imperdiet posuere. Quisque quis pellentesque quam, sit amet dapibus augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed ante lectus, malesuada at nisi sed, mattis malesuada tellus. Morbi elementum nisl et pretium dictum. ",
                },
            ],
        } as OsirisActions;
        return Promise.resolve(details);
    }
}

const grantPort = new GrantPort();
export default grantPort;
