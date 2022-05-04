import DemandeSubvention from "@api-subventions-asso/dto/search/DemandeSubventionDto";
import Versement from "@api-subventions-asso/dto/search/VersementDto";
import Association from "../../../../associations/@types/Association";
import Etablissement from "../../../../etablissements/@types/Etablissement";

export default interface AssociationDto extends Association {
    etablissements: ({ demandes_subventions: DemandeSubvention[] | null, versements: Versement[] | null } & Etablissement)[] | null,
}