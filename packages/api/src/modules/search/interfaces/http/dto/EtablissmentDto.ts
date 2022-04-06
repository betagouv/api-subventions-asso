import Versement from "@api-subventions-asso/dto/search/VersementDto";
import Association from "../../../../associations/@types/Association";
import DemandeSubvention from "../../../../demandes_subventions/@types/DemandeSubvention";
import Etablissement from "../../../../etablissements/@types/Etablissement";

export default interface EtablissementDto extends Etablissement {
    association: Association,
    demandes_subventions: DemandeSubvention[] | null,
    versements: Versement[] | null
}