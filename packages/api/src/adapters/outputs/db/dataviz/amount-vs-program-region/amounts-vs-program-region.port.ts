import AmountsVsProgramRegionEntity from "../../../../../modules/dataViz/amountsVsProgramRegion/entitiyAndDbo/amountsVsProgramRegion.entity";

export interface AmountsVSProgramRegionPort {
    createIndexes(): Promise<void>;

    hasBeenInitialized(): Promise<boolean>;
    insertOne(entity: AmountsVsProgramRegionEntity): Promise<void>;
    upsertOne(entity: AmountsVsProgramRegionEntity): Promise<void>;
    insertMany(entities: AmountsVsProgramRegionEntity[]): Promise<void>;
    upsertMany(entities: AmountsVsProgramRegionEntity[]): Promise<void>;
    findAll(): Promise<AmountsVsProgramRegionEntity[]>;
    deleteAll(): Promise<void>;
}
