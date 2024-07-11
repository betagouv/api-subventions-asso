import { RawGrant } from "../../../grant/@types/rawGrant";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import DemarchesSimplifieesMapperEntity from "../entities/DemarchesSimplifieesMapperEntity";

export interface DemarchesSimplifieesRawGrant extends RawGrant {
    data: DemarchesSimplifieesRawData;
}

export type DemarchesSimplifieesRawData = {
    entity: DemarchesSimplifieesDataEntity;
    schema: DemarchesSimplifieesMapperEntity;
};
