import { OptionalId } from "mongodb";
import SireneEstablishmentDto from "../../../inputs/pipeline/import/sirene-establishment/sirene-establishment.dto";

export type SireneEstablishmentDbo = OptionalId<SireneEstablishmentDto>;

export type SireneEstablishmentDateDbo = {
    siret: string;
    dateDernierTraitementEtablissement: Date;
};
