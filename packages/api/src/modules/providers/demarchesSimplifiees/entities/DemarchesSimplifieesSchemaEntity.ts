export default interface DemarchesSimplifieesSchemaEntity {
    demarcheId: number;
    schema: DemarchesSimplifieesSingleSchema[];
    // TODO: should we make this mandatory ?
    commonSchema?: DemarchesSimplifieesSingleSchema[];
}

export type DemarchesSimplifieesSingleSchema = { to: string; from: string } | { to: string; value: string };
