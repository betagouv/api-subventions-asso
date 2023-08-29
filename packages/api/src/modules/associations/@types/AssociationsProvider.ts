import { Siret, Rna, Siren, Association } from "dto";
import Provider from "../../providers/@types/IProvider";

export default interface AssociationsProvider extends Provider {
    isAssociationsProvider: boolean;

    getAssociationsBySiren(siren: Siren): Promise<Association[] | null>;
    getAssociationsBySiret(siret: Siret): Promise<Association[] | null>;
    getAssociationsByRna(rna: Rna): Promise<Association[] | null>;
}
