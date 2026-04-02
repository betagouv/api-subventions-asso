import MiscScdlGrantEntity from "../../../../../modules/providers/scdl/entities/MiscScdlGrantEntity";
import { ScdlGrantDbo } from "../../../../../modules/providers/scdl/dbo/ScdlGrantDbo";

export interface MiscScdlGrantPort {
    createIndexes(): Promise<void>;

    findOneByAllocatorSiret(siret: string): Promise<MiscScdlGrantEntity | null>;
    findAll(): Promise<MiscScdlGrantEntity[]>;
    findAllCursor(): unknown; // todo: precise return type (refacto AsyncIterable)
    findByAllocatorOnPeriod(siret: string, exercises: number[]): Promise<MiscScdlGrantEntity[]>;
    createMany(dbos: ScdlGrantDbo[]): Promise<void>;
    bulkFindDeleteByExercices(allocatorSiret: string, exercises: number[]): Promise<void>;
    createBackupCollection(allocatorSiret: string): Promise<void>;
    dropBackupCollection(): Promise<void>;
    applyBackupCollection(_allocatorSiret: string): Promise<void>;
}
