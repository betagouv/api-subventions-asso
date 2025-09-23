import { InformationBancaire } from "../shared/InformationBancaire";
import { Personne } from "../shared/Personne";
import { ProviderValues } from "../shared/ProviderValue";
import { DemandeSubvention } from "../demandeSubvention";
import { Payment } from "../payments/Payment";
import { EstablishmentSimplified } from "./EstablishmentSimplified";

export interface Establishment extends EstablishmentSimplified {
    demandes_subventions?: DemandeSubvention[] | null;
    representants_legaux?: ProviderValues<Personne>[];
    contacts?: ProviderValues<Personne>[];
    information_banquaire?: ProviderValues<InformationBancaire>[];
    versements?: Payment[];
}
