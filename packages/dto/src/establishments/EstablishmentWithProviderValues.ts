import { InformationBancaire } from "../shared/InformationBancaire";
import { Personne } from "../shared/Personne";
import { ProviderValues } from "../shared/ProviderValue";
import { DemandeSubvention } from "../demandeSubvention";
import { Payment } from "../payments/Payment";
import { EstablishmentSimplifiedWithProviderValues } from "./EstablishmentSimplifiedWithProviderValues";

export interface EstablishmentWithProviderValues extends EstablishmentSimplifiedWithProviderValues {
    demandes_subventions?: DemandeSubvention[] | null;
    representants_legaux?: ProviderValues<Personne>[];
    contacts?: ProviderValues<Personne>[];
    information_banquaire?: ProviderValues<InformationBancaire>[];
    versements?: Payment[];
}
