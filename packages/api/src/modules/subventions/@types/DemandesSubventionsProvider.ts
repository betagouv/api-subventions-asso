import { Siren, Siret, Rna, DemandeSubvention } from "dto";
import Provider from "../../providers/@types/IProvider";

export default interface DemandesSubventionsProvider extends Provider {
    isDemandesSubventionsProvider: boolean;

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null>;
    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null>;
    getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null>;
}
