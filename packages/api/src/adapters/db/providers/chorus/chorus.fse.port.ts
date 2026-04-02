import ChorusFseEntity from "../../../../modules/providers/chorus/entities/ChorusFseEntity";

export interface ChorusFsePort {
    createIndexes(): Promise<void>;
    upsertMany(entities: ChorusFseEntity[]): Promise<void>;
    findByExercise(exercise: number): Promise<ChorusFseEntity[]>;
}
