import { Siren, Siret, DemandeSubvention } from "dto";
import { RawApplication } from "../../grant/@types/rawGrant";
import GrantProvider from "../../grant/@types/GrantProvider";

export default interface DemandesSubventionsProvider<T> extends GrantProvider {
    isDemandesSubventionsProvider: boolean;

    // TODO: find a way to merge DemandeSubvention and Application...
    rawToApplication: (rawApplication: RawApplication<T>) => DemandeSubvention;

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null>;
    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null>;
}
