import { DemandeSubvention } from "@api-subventions-asso/dto"

export interface SubventionsFlux {
    subventions: DemandeSubvention[],
    count: number,
    totalProvider: number
}