import { Siret } from "../../../@types";
import Etablissement from "./Etablissement";

export default interface EtablissementProvider {
    isEtablissementProvider: boolean,

    getEtablissementsBySiret(siret: Siret, wait?: boolean): Promise<Etablissement[] | null>
}