import { ProviderDetails } from "./provider-details";

export interface SimplifiedAction {
    intitule: string;
    description: string;
}

export interface OsirisActions {
    actions: SimplifiedAction[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OsirisDetails extends ProviderDetails<OsirisActions> {}
