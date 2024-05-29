import { Siren, Siret, DemandeSubvention } from "dto";
import Provider from "../../providers/@types/IProvider";

export default interface DemandesSubventionsProvider extends Provider {
    isDemandesSubventionsProvider: boolean;

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null>;
    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null>;
}
