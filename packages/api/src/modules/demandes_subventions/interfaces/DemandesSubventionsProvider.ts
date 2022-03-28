import { Siret } from "../../../@types";
import DemandeSubvention from "./DemandeSubvention";

export default interface DemandesSubventionsProvider {
    isDemandesSubventionsProvider: boolean,

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null>
}