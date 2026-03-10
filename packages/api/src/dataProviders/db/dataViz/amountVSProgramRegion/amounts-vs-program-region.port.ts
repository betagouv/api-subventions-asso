import AmountsVsProgramRegionEntity from "../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.entity";

export interface AmountsVsProgramRegionPort {
    createIndexes(): Promise<void>;

    hasBeenInitialized(): Promise<boolean>;
    insertOne(entity: AmountsVsProgramRegionEntity): Promise<string>;
    upsertOne(entity: AmountsVsProgramRegionEntity): Promise<string | undefined>;
    insertMany(entities: AmountsVsProgramRegionEntity[]): Promise<string[] | undefined>;
    upsertMany(entities: AmountsVsProgramRegionEntity[]): Promise<string[] | undefined>;
    findAll(): Promise<AmountsVsProgramRegionEntity[]>;
    deleteAll(): Promise<boolean>;
}
