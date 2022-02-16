import {ProviderValues} from "../../../@types/ProviderValue";
import { Siret } from "../../../@types/Siret";
import { DefaultObject } from "../../../@types/utils";

export default interface Etablissement extends DefaultObject<(
                                                ProviderValues<unknown> 
                                                | ProviderValues<unknown>[]
                                                | DefaultObject<ProviderValues<unknown>> 
                                                | DefaultObject<ProviderValues<unknown>>[]
                                                | unknown
                                                | undefined 
                                            )>{
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