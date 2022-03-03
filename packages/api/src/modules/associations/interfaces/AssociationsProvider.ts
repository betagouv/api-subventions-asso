import { Rna } from "../../../@types/Rna";
import Association from "./Association";

export default interface AssociationsProvider {
    isAssociationsProvider: boolean,

    getAssociationsBySiren(siren: string, rna?: Rna): Promise<Association[] | null>;
}