import DemarchesSimplifieesDataEntity from "../../../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesDataEntity";
import Siret from "../../../../identifierObjects/Siret";
import Siren from "../../../../identifierObjects/Siren";

export interface DemarchesSimplifieesDataProviderPort {
    createIndexes(): Promise<void>;

    upsert(entity: DemarchesSimplifieesDataEntity): Promise<void>;
    findBySiret(siret: Siret): Promise<DemarchesSimplifieesDataEntity[]>;
    findBySiren(siren: Siren): Promise<DemarchesSimplifieesDataEntity[]>;
    bulkUpsert(entities: DemarchesSimplifieesDataEntity[]): Promise<void>;
    findAllCursor(): unknown; // todo: precise return type (refacto AsyncIterable)
}
