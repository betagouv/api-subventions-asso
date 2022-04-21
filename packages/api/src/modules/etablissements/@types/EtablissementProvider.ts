import { Siren, Siret } from "@api-subventions-asso/dto";
import Provider from '../../providers/@types/Provider';
import Etablissement from "./Etablissement";

export default interface EtablissementProvider extends Provider {
    isEtablissementProvider: boolean,

    getEtablissementsBySiret(siret: Siret, wait?: boolean): Promise<Etablissement[] | null>
    getEtablissementsBySiren(siret: Siren, wait?: boolean): Promise<Etablissement[] | null>
}