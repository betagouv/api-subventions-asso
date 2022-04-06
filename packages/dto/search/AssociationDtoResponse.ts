import Etablissement from "../../api/src/modules/etablissements/@types/Etablissement";
import AssociationDto from "./AssociationDto";
import DemandeSubvention from "./DemandeSubventionDto";

export interface IAssociation extends AssociationDto {
    etablissements: ({ demandes_subventions: DemandeSubvention[] | null } & Etablissement)[] | null,
}

export default interface AssociationDtoResponse {
    success: boolean;
    association?: IAssociation,
    message?: string
}