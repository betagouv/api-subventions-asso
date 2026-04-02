import FonjepTypePosteEntity from "../../../../modules/providers/fonjep/entities/FonjepTypePosteEntity";

export interface FonjepTypePostePort {
    createIndexes(): Promise<void>;

    insertMany(entities: FonjepTypePosteEntity[]): Promise<void>;
    findByCode(code: string): Promise<FonjepTypePosteEntity[]>;
    findAll(): Promise<FonjepTypePosteEntity[]>;
    drop(): Promise<void>;
    rename(name: string): Promise<void>;
}
