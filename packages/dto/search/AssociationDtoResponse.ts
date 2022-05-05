import AssociationDto from "./AssociationDto";
import DemandeSubvention from "./DemandeSubventionDto";
import EtablissementDto from "./EtablissmentDto";

export interface IAssociation extends AssociationDto {
    etablissements: ({ demandes_subventions: DemandeSubvention[] | null } & EtablissementDto)[] | null,
}

export default interface AssociationDtoResponse {
    success: boolean;
    association?: IAssociation,
    message?: string
}