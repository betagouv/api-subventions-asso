import { AssociationWithProviderValues } from "../associations";
import { DemandeSubvention } from "../demandeSubvention";
import { EstablishmentWithProviderValues } from "./EstablishmentWithProviderValues";

export interface EstablishmentDetailed extends EstablishmentWithProviderValues {
    association: AssociationWithProviderValues;
    demandes_subventions: DemandeSubvention[] | null;
}

export interface EstablishmentDtoResponse {
    etablissement?: EstablishmentDetailed;
    message?: string;
}
