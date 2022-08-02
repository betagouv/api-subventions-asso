import { DemandeSubvention } from "@api-subventions-asso/dto"

export interface SubventionsFlux {
    subventions: DemandeSubvention[],
    __meta__: {
        providerCalls: number,
        providerAnswers: number
    }
}