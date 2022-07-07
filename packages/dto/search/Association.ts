import { Adresse } from '../shared/Adresse';
import { ProviderValues } from "../shared/ProviderValue";
import { Rna } from "../shared/Rna";
import { Siren } from "../shared/Siren";
import { Siret } from "../shared/Siret";
import { DemandeSubvention } from './DemandeSubvention';
import { Etablissement } from './Etablissment';
import { Versement } from "./Versement";

export interface Association {
    siren?: ProviderValues<Siren>,
    rna?: ProviderValues<Rna>,
    nic_siege?: ProviderValues<string>,
    categorie_juridique?: ProviderValues<string>,
    denomination: ProviderValues<string>,
    date_creation?: ProviderValues<Date>,
    date_modification?: ProviderValues<Date>,
    date_modification_siren?: ProviderValues<Date>,
    objet_social?: ProviderValues<string>;
    code_objet_social_1?: ProviderValues<string>;
    code_objet_social_2?: ProviderValues<string>;
    etablisements_siret?: ProviderValues<Siret[]>;
    adresse_siege?: ProviderValues<Adresse>,
    federation?: ProviderValues<string>,
    licencies?: { // Uniquement les asso sportive
        total?: ProviderValues<number>,
        hommes?: ProviderValues<number>,
        femmes?: ProviderValues<number>,
    },
    benevoles?: {
        nombre?: ProviderValues<number>,
        ETPT?: ProviderValues<number>,
    },
    salaries?: {
        nombre?: ProviderValues<number>,
        cdi?: ProviderValues<number>,
        cdiETPT?: ProviderValues<number>,
        cdd?: ProviderValues<number>,
        cddETPT?: ProviderValues<number>,
        emploisAides?: ProviderValues<number>,
        emploisAidesETPT?: ProviderValues<number>
    },
    volontaires?: {
        nombre?: ProviderValues<number>,
        ETPT?: ProviderValues<number>,
    }
    versements?: Versement[],
    etablissements?: ({ demandes_subventions: DemandeSubvention[] | null } & Etablissement)[] | null
}