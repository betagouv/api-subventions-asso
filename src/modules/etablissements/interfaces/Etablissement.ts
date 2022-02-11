import ProviderValue from "../../../@types/ProviderValue";
import { Siret } from "../../../@types/Siret";

export default interface Etablissement {
    siret: ProviderValue<Siret>,
    nic: ProviderValue<string>,
    siege: ProviderValue<boolean>,
    adresse?: {
        numero?: ProviderValue<string>,
        type_voie?: ProviderValue<string>,
        voie?: ProviderValue<string>,
        code_postal?: ProviderValue<string>,
        commune?: ProviderValue<string>,
    }
    representants_legaux?: { // data provider
        nom?: ProviderValue<string>,
        prenom?: ProviderValue<string>,
        civilite?: ProviderValue<string>,
        telephone?: ProviderValue<string>,
        email?: ProviderValue<string>,
        role?: ProviderValue<string>
    }[]
    information_banquaire?: ProviderValue<{ // data provider
        iban?: string,
        bic?: string,
    }>[]
}