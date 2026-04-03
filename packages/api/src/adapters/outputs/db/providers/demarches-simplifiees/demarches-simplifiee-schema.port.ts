import DemarchesSimplifieesSchema from "../../../../../modules/providers/demarches-simplifiees/entities/DemarchesSimplifieesSchema";

export interface DemarchesSimplifieeSchemaPort {
    createIndexes(): Promise<void>;

    upsert(entity: DemarchesSimplifieesSchema): Promise<void>;
    findAll(): Promise<DemarchesSimplifieesSchema[]>;
    getAcceptedDemarcheIds(): Promise<number[]>;
    findById(demarcheId: number): Promise<DemarchesSimplifieesSchema | null>;
}
