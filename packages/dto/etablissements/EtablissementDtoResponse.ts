import { Association } from "../associations";
import { DemandeSubvention } from "../demandeSubvention";
import { Etablissement } from "./Etablissement";

export interface IEtablissement extends Etablissement {
    association: Association;
    demandes_subventions: DemandeSubvention[] | null;
}

export interface EtablissementDtoResponse {
    etablissement?: IEtablissement;
    message?: string;
}
