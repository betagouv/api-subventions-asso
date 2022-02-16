import { Siret } from "../../../@types/Siret";
import DemandeSubvention from "./DemandeSubvention";

export default interface DemandesSubventionsProvider {
    isDemandesSubventionsProvider: boolean,

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null>
}