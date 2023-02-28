import { Association } from "../associations/Association";
import { DemandeSubvention } from "../search/DemandeSubvention";
import { Etablissement } from "./Etablissement";

export interface IEtablissement extends Etablissement {
    association: Association;
    demandes_subventions: DemandeSubvention[] | null;
}

export interface EtablissementDtoResponse {
    success: boolean;
    etablissement?: IEtablissement;
    message?: string;
}
