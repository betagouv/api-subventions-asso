import { RawGrant } from "../../../grant/@types/rawGrant";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import DemarchesSimplifieesSchemaEntity from "../entities/DemarchesSimplifieesSchemaEntity";

export interface DemarchesSimplifieesRawGrant extends RawGrant {
    data: DemarchesSimplifieesRawData;
}

export type DemarchesSimplifieesRawData = {
    entity: DemarchesSimplifieesDataEntity;
    schema: DemarchesSimplifieesSchemaEntity;
};
