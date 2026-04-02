import Siren from "../../../../identifierObjects/Siren";
import Siret from "../../../../identifierObjects/Siret";
import ChorusEntity from "../../../../modules/providers/chorus/entities/ChorusEntity";

export interface ChorusPort {
    createIndexes(): Promise<void>;

    findOneByEJ(ej: string): Promise<ChorusEntity | null>;
    findOneBySiret(siret: Siret): Promise<ChorusEntity | null>;
    findOneBySiren(siren: Siren): Promise<ChorusEntity | null>;
    findOneByUniqueId(uniqueId: string): Promise<ChorusEntity | null>;
    create(entity: ChorusEntity): Promise<void>;
    upsertMany(entities: ChorusEntity[]): Promise<void>;
    update(entity: ChorusEntity): Promise<void>;
    findBySiret(siret: Siret): Promise<ChorusEntity[]>;
    findByEJ(ej: string): Promise<ChorusEntity[]>;
    findBySiren(siren: Siren): Promise<ChorusEntity[]>;
    cursorFind(): AsyncIterable<ChorusEntity>;
    cursorFindOnExercise(exercice: number): AsyncIterable<ChorusEntity>;
}
