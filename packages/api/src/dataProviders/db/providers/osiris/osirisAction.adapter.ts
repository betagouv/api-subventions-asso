import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import OsirisActionEntityDbo from "../../../../modules/providers/osiris/entities/OsirisActionEntityDbo";

export default class OsirisActionAdapter {
    public static toDbo(entity: OsirisActionEntity): OsirisActionEntityDbo {
        return new OsirisActionEntityDbo(entity.indexedInformations, entity.data, entity._id);
    }

    public static toEntity(dbo: OsirisActionEntityDbo): OsirisActionEntity {
        return new OsirisActionEntity(dbo.indexedInformations, dbo.data, dbo._id);
    }
}
