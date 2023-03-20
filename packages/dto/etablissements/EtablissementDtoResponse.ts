import { Association } from "../associations/Association";
import { DemandeSubvention } from "../search/DemandeSubvention";
import { Etablissement } from "./Etablissement";

export interface IEtablissement extends Etablissement {
    association: Association;
    demandes_subventions: DemandeSubvention[] | null;
}

export interface EtablissementDtoResponse {
    etablissement?: IEtablissement;
    message?: string;
}
