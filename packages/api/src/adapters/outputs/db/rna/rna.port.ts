import { RnaEntity } from "../../../../entities/RnaEntity";
import { Rna } from "../../../../identifier-objects";
import RnaDbo from "./rna.dbo";

export interface RnaPort {
    insertMany(lines: RnaDbo[]): Promise<void>;
    getByRna(rna: Rna): Promise<RnaEntity | null>;
}
