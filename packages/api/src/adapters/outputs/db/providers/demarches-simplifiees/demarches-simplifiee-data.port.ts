import DemarchesSimplifieesDataEntity from "../../../../../modules/providers/demarches-simplifiees/entities/DemarchesSimplifieesDataEntity";
import Siret from "../../../../../identifier-objects/Siret";
import Siren from "../../../../../identifier-objects/Siren";

export interface DemarchesSimplifieesDataProviderPort {
    createIndexes(): Promise<void>;

    upsert(entity: DemarchesSimplifieesDataEntity): Promise<void>;
    findBySiret(siret: Siret): Promise<DemarchesSimplifieesDataEntity[]>;
    findBySiren(siren: Siren): Promise<DemarchesSimplifieesDataEntity[]>;
    bulkUpsert(entities: DemarchesSimplifieesDataEntity[]): Promise<void>;
    findAllCursor(): unknown; // todo: precise return type (refacto AsyncIterable)
}
