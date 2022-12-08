import { InformationBancaire } from '../shared/InformationBancaire';
import { Personne } from '../shared/Personne';
import { ProviderValues } from "../shared/ProviderValue";
import { DemandeSubvention } from "../search/DemandeSubvention";
import { Versement } from "../versements/Versement";
import { SimplifiedEtablissement } from "./SimplifiedEtablissement";

export interface Etablissement extends SimplifiedEtablissement {
    demandes_subventions?: DemandeSubvention[] | null
    representants_legaux?: ProviderValues<Personne>[]
    contacts?: ProviderValues<Personne>[],
    information_banquaire?: ProviderValues<InformationBancaire>[],
    versements?: Versement[],
}