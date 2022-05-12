import { Siret, Rna, Siren ,Association} from "@api-subventions-asso/dto";
import Provider from '../../providers/@types/IProvider';

export default interface AssociationsProvider extends Provider {
    isAssociationsProvider: boolean,

    getAssociationsBySiren(siren: Siren, rna?: Rna): Promise<Association[] | null>;
    getAssociationsBySiret(siret: Siret, rna?: Rna): Promise<Association[] | null>;
    getAssociationsByRna(rna: Rna): Promise<Association[] | null>;
}