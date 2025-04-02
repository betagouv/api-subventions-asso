import { Adresse } from "../shared/Adresse";
import { ProviderValues } from "../shared/ProviderValue";
import { RnaDto } from "../shared/Rna";
import { SirenDto } from "../shared/Siren";
import { SiretDto } from "../shared/Siret";
import { DemandeSubvention } from "../demandeSubvention";
import { Etablissement } from "../etablissements/Etablissement";
import { Payment } from "../payments/Payment";
import { ExtraitRcsDto } from "./ExtraitRcsDto";
import { BodaccRecordDto } from "./BodaccRecordDto";
import { AssociationNature } from "./AssociationNature";

export interface Association {
    siren?: ProviderValues<SirenDto>;
    rna?: ProviderValues<RnaDto>;
    nic_siege?: ProviderValues<string>;
    categorie_juridique?: ProviderValues<string>;
    denomination_siren?: ProviderValues<string>;
    denomination_rna?: ProviderValues<string>;
    date_creation_siren?: ProviderValues<Date>;
    date_creation_rna?: ProviderValues<Date>;
    date_modification_rna?: ProviderValues<Date>;
    date_modification_siren?: ProviderValues<Date>;
    objet_social?: ProviderValues<string>;
    code_objet_social_1?: ProviderValues<string>;
    code_objet_social_2?: ProviderValues<string>;
    etablisements_siret?: ProviderValues<SiretDto[]>;
    adresse_siege_rna?: ProviderValues<Adresse>;
    adresse_siege_siren?: ProviderValues<Adresse>;
    nature?: ProviderValues<AssociationNature>;
    // Association reconnue d'utilité publique (RUP)
    rup?: ProviderValues<boolean>;
    // Date de reconnaissance
    date_rup?: ProviderValues<string>;
    federation?: ProviderValues<string>;
    licencies?: {
        // Uniquement les asso sportive
        total?: ProviderValues<number>;
        hommes?: ProviderValues<number>;
        femmes?: ProviderValues<number>;
    };
    benevoles?: {
        nombre?: ProviderValues<number>;
        ETPT?: ProviderValues<number>;
    };
    salaries?: {
        nombre?: ProviderValues<number>;
        cdi?: ProviderValues<number>;
        cdiETPT?: ProviderValues<number>;
        cdd?: ProviderValues<number>;
        cddETPT?: ProviderValues<number>;
        emploisAides?: ProviderValues<number>;
        emploisAidesETPT?: ProviderValues<number>;
    };
    volontaires?: {
        nombre?: ProviderValues<number>;
        ETPT?: ProviderValues<number>;
    };
    versements?: Payment[];
    etablissements?: ({ demandes_subventions: DemandeSubvention[] | null } & Etablissement)[] | null;
    extrait_rcs?: ProviderValues<ExtraitRcsDto> | null;
    bodacc?: ProviderValues<BodaccRecordDto[]>;
}
