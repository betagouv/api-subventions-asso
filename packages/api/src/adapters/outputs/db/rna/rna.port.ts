import RnaDbo from "./rna.dbo";

export interface RnaPort {
    insertMany(lines: RnaDbo[]): Promise<void>;
}
