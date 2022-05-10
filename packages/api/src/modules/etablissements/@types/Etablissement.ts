import { Adresse } from '@api-subventions-asso/dto/shared/Adresse';
import { Personne } from '@api-subventions-asso/dto/shared/Personne';
import { InformationBancaire } from '@api-subventions-asso/dto/shared/InformationBancaire';
import { ProviderValues, Siret, DefaultObject } from "../../../@types";

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
    ouvert?: ProviderValues<boolean>,
    adresse?: ProviderValues<Adresse>,
    representants_legaux?: ProviderValues<Personne>[]
    contacts?: ProviderValues<Personne>[],
    information_banquaire?: ProviderValues<InformationBancaire>[]
}