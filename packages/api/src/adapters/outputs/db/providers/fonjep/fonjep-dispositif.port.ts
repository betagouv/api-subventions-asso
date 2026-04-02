import FonjepDispositifEntity from "../../../../../modules/providers/fonjep/entities/FonjepDispositifEntity";

export interface FonjepDispositifPort {
    createIndexes(): Promise<void>;

    insertMany(entities: FonjepDispositifEntity[]): Promise<void>;
    findByID(id: number): Promise<FonjepDispositifEntity[]>;
    findAll(): Promise<FonjepDispositifEntity[]>;
    drop(): Promise<void>;
    rename(name: string): Promise<void>;
}
