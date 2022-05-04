import { Siret, Rna, Siren } from "@api-subventions-asso/dto";
import Provider from '../../providers/@types/Provider';
import Association from "./Association";

export default interface AssociationsProvider extends Provider {
    isAssociationsProvider: boolean,

    getAssociationsBySiren(siren: Siren, rna?: Rna): Promise<Association[] | null>;
    getAssociationsBySiret(siret: Siret, rna?: Rna): Promise<Association[] | null>;
    getAssociationsByRna(rna: Rna): Promise<Association[] | null>;
}