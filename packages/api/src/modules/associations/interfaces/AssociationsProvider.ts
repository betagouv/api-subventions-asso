import { Rna, Siren } from "../../../@types";
import Association from "./Association";

export default interface AssociationsProvider {
    isAssociationsProvider: boolean,

    getAssociationsBySiren(siren: Siren, rna?: Rna): Promise<Association[] | null>;
    getAssociationsByRna(rna: Rna): Promise<Association[] | null>;
}