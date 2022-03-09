import { ProviderValues } from "../shared/ProviderValue";
import { Rna } from "../shared/Rna";
import { Siren } from "../shared/Siren";
import { Siret } from "../shared/Siret";

export default interface AssociationDto {
    siren?: ProviderValues<Siren>,
    rna?: ProviderValues<Rna>,
    nic_siege?: ProviderValues<string>,
    categorie_juridique?: ProviderValues<string>,
    denomination: ProviderValues<string>,
    date_creation?: ProviderValues<Date>,
    date_modification?: ProviderValues<Date>,
    objet_social?: ProviderValues<string>;
    code_objet_social_1?: ProviderValues<string>;
    code_objet_social_2?: ProviderValues<string>;
    etablisements_siret?: ProviderValues<Siret[]>;
    adresse_siege?: ProviderValues<{ // via rna et ou osiris
        numero?: string,
        type_voie?: string,
        voie?: string,
        code_postal?: string,
        commune?: string,
    }>,
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
    // etablissements: ({ demandes_subventions: DemandeSubvention[] | null } & Etablissement)[] | null,
}