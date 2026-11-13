import ChorusFseEntity from "../../../../../modules/providers/chorus/entities/ChorusFseEntity";
import { ChorusFseDbo } from "./chorus.dbo";

export interface ChorusFsePort {
    createIndexes(): Promise<void>;
    upsertMany(entities: ChorusFseDbo[]): Promise<void>;
    findByExercise(exercise: number): Promise<ChorusFseEntity[]>;
}
