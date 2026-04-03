import FonjepVersementEntity from "../../../../../modules/providers/fonjep/entities/FonjepVersementEntity";

export interface FonjepVersementsPort {
    createIndexes(): Promise<void>;

    insertMany(entities: FonjepVersementEntity[]): Promise<void>;
    findByPosteCode(PosteCode: string): Promise<FonjepVersementEntity[]>;
    findAll(): Promise<FonjepVersementEntity[]>;
    drop(): Promise<void>;
    rename(name: string): Promise<void>;
}
