import { ProviderDetails } from "./ProviderDetails";

export interface SimplifiedAction {
    intitule: string;
    description: string;
}

export default interface OsirisDetails extends ProviderDetails {
    details: {
        actions: SimplifiedAction[];
    };
}
