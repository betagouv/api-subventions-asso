import { Association } from "../associations";
import { DemandeSubvention } from "../demandeSubvention";
import { Establishment } from "./Establishment";

export interface EstablishmentDetailed extends Establishment {
    association: Association;
    demandes_subventions: DemandeSubvention[] | null;
}

export interface EstablishmentDtoResponse {
    etablissement?: EstablishmentDetailed;
    message?: string;
}
