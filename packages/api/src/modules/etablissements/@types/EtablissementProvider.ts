import { Siren, Siret } from "@api-subventions-asso/dto";
import Etablissement from "./Etablissement";

export default interface EtablissementProvider {
    isEtablissementProvider: boolean,

    getEtablissementsBySiret(siret: Siret, wait?: boolean): Promise<Etablissement[] | null>
    getEtablissementsBySiren(siret: Siren, wait?: boolean): Promise<Etablissement[] | null>
}