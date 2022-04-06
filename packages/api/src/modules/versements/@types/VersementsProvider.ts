import { Siren, Siret } from "../../../@types";
import Versement from "./Versement";

export default interface VersementsProvider {

    isVersementsProvider: boolean;

    getVersementsByEJ(ej: string): Promise<Versement[]>;
    getVersementsBySiret(siret: Siret): Promise<Versement[]>;
    getVersementsBySiren(siren: Siren): Promise<Versement[]>;
}