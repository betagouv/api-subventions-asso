import Siren from "../../../../../identifier-objects/Siren";
import Siret from "../../../../../identifier-objects/Siret";
import ChorusEntity from "../../../../../domain/providers/chorus/ChorusEntity";
import ChorusDbo from "./chorus.dbo";

export interface ChorusPort {
    createIndexes(): Promise<void>;

    findOneByEJ(ej: string): Promise<ChorusEntity | null>;
    findOneBySiret(siret: Siret): Promise<ChorusEntity | null>;
    findOneBySiren(siren: Siren): Promise<ChorusEntity | null>;
    upsertMany(entities: ChorusDbo[]): Promise<void>;
    findBySiret(siret: Siret): Promise<ChorusEntity[]>;
    findByEJ(ej: string): Promise<ChorusEntity[]>;
    findBySiren(siren: Siren): Promise<ChorusEntity[]>;
    cursorFind(query?): AsyncIterable<ChorusEntity>;
    cursorFindOnExercise(exercice: number): AsyncIterable<ChorusEntity>;
}
