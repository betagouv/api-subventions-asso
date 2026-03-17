import DemarchesSimplifieesSchema from "../../../../modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesSchema";

export interface DemarchesSimplifieeSchemaPort {
    createIndexes(): Promise<void>;

    upsert(entity: DemarchesSimplifieesSchema): Promise<void>;
    findAll(): Promise<DemarchesSimplifieesSchema[]>;
    getAcceptedDemarcheIds(): Promise<number[]>;
    findById(demarcheId: number): Promise<DemarchesSimplifieesSchema | null>;
}
