import { Versement, Siren, Siret } from "@api-subventions-asso/dto";
import Provider from '../../providers/@types/IProvider';

export default interface VersementsProvider extends Provider {

    isVersementsProvider: boolean;

    getVersementsByEJ(ej: string): Promise<Versement[]>;
    getVersementsBySiret(siret: Siret): Promise<Versement[]>;
    getVersementsBySiren(siren: Siren): Promise<Versement[]>;
}