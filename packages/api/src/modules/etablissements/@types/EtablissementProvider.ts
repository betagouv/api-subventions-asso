import { Siren, Siret, Etablissement } from "dto";
import Provider from "../../providers/@types/IProvider";

export default interface EtablissementProvider extends Provider {
    isEtablissementProvider: boolean;

    getEtablissementsBySiret(siret: Siret, wait?: boolean): Promise<Etablissement[] | null>;
    getEtablissementsBySiren(siret: Siren, wait?: boolean): Promise<Etablissement[] | null>;
}
