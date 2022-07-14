import { Etablissement } from "./Etablissement";
import { Association } from "./Association";
import { DemandeSubvention } from "./DemandeSubvention";

export interface IEtablissement extends Etablissement {
    association: Association,
    demandes_subventions: DemandeSubvention[] | null
}

export default interface EtablissementDtoResponse {
    success: boolean;
    etablissement?: IEtablissement,
    message?: string
}