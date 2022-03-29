import { Siret, Rna, Siren } from "@api-subventions-asso/dto";
import Association from "./Association";

export default interface AssociationsProvider {
    isAssociationsProvider: boolean,

    getAssociationsBySiren(siren: Siren, rna?: Rna): Promise<Association[] | null>;
    getAssociationsBySiret(siret: Siret, rna?: Rna): Promise<Association[] | null>;
    getAssociationsByRna(rna: Rna): Promise<Association[] | null>;
}