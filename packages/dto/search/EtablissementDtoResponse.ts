import Etablissement from "./EtablissmentDto";
import AssociationDto from "./AssociationDto";
import DemandeSubvention from "./DemandeSubventionDto";

export interface IEtablissement extends Etablissement {
    association: AssociationDto,
    demandes_subventions: DemandeSubvention[] | null
}

export default interface EtablissementDtoResponse {
    success: boolean;
    etablissement?: IEtablissement,
    message?: string
}