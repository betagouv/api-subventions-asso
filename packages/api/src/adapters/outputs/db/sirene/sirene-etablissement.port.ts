import Siret from "../../../../identifier-objects/Siret";
import { SireneEtablissementEntity } from "../../../../entities/SireneEtablissementEntity";

export interface SireneEtablissementPort {
    createIndexes(): Promise<void>;
    upsertMany(entities: SireneEtablissementEntity[]): Promise<void>;
    findOneBySiret(siret: Siret): Promise<SireneEtablissementEntity | null>;
}
