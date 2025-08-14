import { WithId } from "mongodb";
import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";

export default class OsirisActionAdapter {
    public static toEntity(dbo: WithId<OsirisActionEntity>): OsirisActionEntity {
        return new OsirisActionEntity(dbo.indexedInformations, dbo.data, dbo.updateDate);
    }
}
