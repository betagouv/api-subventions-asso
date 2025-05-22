export default interface DemarchesSimplifieesSchema {
    demarcheId: number;
    schema: DemarchesSimplifieesSchemaLine[];
    commonSchema?: DemarchesSimplifieesSchemaLine[];
}

export type DemarchesSimplifieesSchemaLine = { to: string; from: string } | { to: string; value: string };
