import { Versement, Siren, Siret } from "dto";
import Provider from "../../providers/@types/IProvider";

export default interface VersementsProvider extends Provider {
    isVersementsProvider: boolean;

    getVersementsByKey(key: string): Promise<Versement[]>;
    getVersementsBySiret(siret: Siret): Promise<Versement[]>;
    getVersementsBySiren(siren: Siren): Promise<Versement[]>;
}
