import { ProviderValues } from "../shared/ProviderValue";
import { Siret } from "../shared/Siret";
import DemandeSubvention from "./DemandeSubventionDto";

export default interface EtablissementDto {
    demandes_subventions: DemandeSubvention[] | null
    siret: ProviderValues<Siret>,
    nic: ProviderValues<string>,
    siege?: ProviderValues<boolean>,
    adresse?: ProviderValues<{
        numero?: string,
        type_voie?: string,
        voie?: string,
        code_postal?: string,
        commune?: string,
    }>,
    representants_legaux?: ProviderValues<{ // data provider
        nom?:string,
        prenom?:string,
        civilite?:string,
        telephone?:string,
        email?:string,
        role?:string
    }>[]
    contacts?: ProviderValues<{ // data provider
        nom?:string,
        prenom?:string,
        civilite?:string,
        telephone?:string,
        email?:string,
        role?:string
    }>[],
    information_banquaire?: ProviderValues<{ // data provider
        iban?: string,
        bic?: string,
    }>[]
}