import Versement from "@api-subventions-asso/dto/search/VersementDto";
import Association from "../../../../associations/interfaces/Association";
import DemandeSubvention from "../../../../demandes_subventions/interfaces/DemandeSubvention";
import Etablissement from "../../../../etablissements/interfaces/Etablissement";

export default interface EtablissementDto extends Etablissement {
    association: Association,
    demandes_subventions: DemandeSubvention[] | null,
    versements: Versement[] | null
}