import Etablissement from "../../api/src/modules/etablissements/interfaces/Etablissement";
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