import { Siren, Siret } from "../../../@types";
import Provider from '../../providers/@types/IProvider';
import Versement from "./Versement";

export default interface VersementsProvider extends Provider {

    isVersementsProvider: boolean;

    getVersementsByEJ(ej: string): Promise<Versement[]>;
    getVersementsBySiret(siret: Siret): Promise<Versement[]>;
    getVersementsBySiren(siren: Siren): Promise<Versement[]>;
}