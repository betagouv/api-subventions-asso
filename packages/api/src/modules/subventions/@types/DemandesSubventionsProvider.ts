import { Siren, Siret, Rna , DemandeSubvention } from "@api-subventions-asso/dto";

export default interface DemandesSubventionsProvider {
    isDemandesSubventionsProvider: boolean,

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null>
    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null>
    getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null>
    getDemandeSubventionById(id: string): Promise<DemandeSubvention>
}