import { Adresse } from '../shared/Adresse';
import { InformationBancaire } from '../shared/InformationBancaire';
import { Personne } from '../shared/Personne';
import { ProviderValues } from "../shared/ProviderValue";
import { Siret } from "../shared/Siret";
import { DemandeSubvention } from "./DemandeSubvention";
import { Versement } from "./Versement";

export interface Etablissement {
    demandes_subventions?: DemandeSubvention[] | null
    siret: ProviderValues<Siret>,
    nic: ProviderValues<string>,
    siege?: ProviderValues<boolean>,
    ouvert?: ProviderValues<boolean>,
    adresse?: ProviderValues<Adresse>,
    representants_legaux?: ProviderValues<Personne>[]
    contacts?: ProviderValues<Personne>[],
    information_banquaire?: ProviderValues<InformationBancaire>[]
    versements?: Versement[],
}