import GisproEntity from "../../../modules/providers/dauphin-gispro/@types/GisproEntity";

export interface GisproPort {
    createIndexes(): Promise<void>;

    insertMany(entities: GisproEntity[]): Promise<void>;
    findAll(): Promise<GisproEntity[]>;
}
