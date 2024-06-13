import { Siren, Siret, DemandeSubvention } from "dto";
import Provider from "../../providers/@types/IProvider";
import { RawApplication } from "../../grant/@types/rawGrant";

export default interface DemandesSubventionsProvider<T> extends Provider {
    isDemandesSubventionsProvider: boolean;

    // TODO: find a way to merge DemandeSubvention and Application...
    rawToApplication: (rawApplication: RawApplication<T>) => DemandeSubvention;

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null>;
    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null>;
}
