import { DemandeSubvention } from "dto";

export interface SubventionsFlux {
    subventions?: DemandeSubvention[];
    __meta__?: {
        totalProviders: number;
        provider?: string;
    };
}
