import { DemandeSubvention } from "@api-subventions-asso/dto";

export interface SubventionsFlux {
    subventions?: DemandeSubvention[];
    __meta__?: {
        totalProviders: number;
        provider?: string;
    };
}
