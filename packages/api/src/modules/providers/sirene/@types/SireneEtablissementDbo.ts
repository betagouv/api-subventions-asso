import { OptionalId } from "mongodb";
import { SireneEtablissementEntity } from "../../../../entities/SireneEtablissementEntity";

export type SireneEtablissementDbo = Omit<OptionalId<SireneEtablissementEntity>, "siren" | "siret"> & {
    siren: string;
    siret: string;
};
