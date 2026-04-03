import FonjepPosteEntity from "../../../../../modules/providers/fonjep/entities/FonjepPosteEntity";

export interface FonjepPostesPort {
    createIndexes(): Promise<void>;

    insertMany(entities: FonjepPosteEntity[]): Promise<void>;
    findByCode(code: string): Promise<FonjepPosteEntity[]>;
    findAll(): Promise<FonjepPosteEntity[]>;
    drop(): Promise<void>;
    rename(name: string): Promise<void>;
}
