import Siren from "../../../../../identifier-objects/Siren";
import Siret from "../../../../../identifier-objects/Siret";
import ChorusEntity from "../../../../../modules/providers/chorus/entities/ChorusEntity";
import ChorusDbo from "./chorus.dbo";

// @TODO: make all return ChorusEntity when ChorusEntity will be implemented as a class
export interface ChorusPort {
    createIndexes(): Promise<void>;

    findOneByEJ(ej: string): Promise<ChorusDbo | null>;
    findOneBySiret(siret: Siret): Promise<ChorusDbo | null>;
    findOneBySiren(siren: Siren): Promise<ChorusDbo | null>;
    // create(entity: ChorusEntity): Promise<void>;
    upsertMany(entities: ChorusDbo[]): Promise<void>;
    update(entity: ChorusEntity): Promise<void>;
    findBySiret(siret: Siret): Promise<ChorusDbo[]>;
    findByEJ(ej: string): Promise<ChorusDbo[]>;
    findBySiren(siren: Siren): Promise<ChorusDbo[]>;
    cursorFind(query?): AsyncIterable<ChorusDbo>;
    cursorFindOnExercise(exercice: number): AsyncIterable<ChorusDbo>;
}
