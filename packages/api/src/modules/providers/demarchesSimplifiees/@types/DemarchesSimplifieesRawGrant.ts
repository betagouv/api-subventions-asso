import { RawGrant } from "../../../grant/@types/rawGrant";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import DemarchesSimplifieesSchema from "../entities/DemarchesSimplifieesSchema";

export interface DemarchesSimplifieesRawGrant extends RawGrant {
    data: DemarchesSimplifieesRawData;
}

export type DemarchesSimplifieesRawData = {
    entity: DemarchesSimplifieesDataEntity;
    schema: DemarchesSimplifieesSchema;
};
