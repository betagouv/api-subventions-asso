import FonjepTiersEntity from "../../../../modules/providers/fonjep/entities/FonjepTiersEntity";

export interface FonjepTiersPort {
    createIndexes(): Promise<void>;

    insertMany(entities: FonjepTiersEntity[]): Promise<void>;
    findBySiretOuRidet(siretOuRidet: string): Promise<FonjepTiersEntity[]>;
    findAll(): Promise<FonjepTiersEntity[]>;
    drop(): Promise<void>;
    rename(name: string): Promise<void>;
}
