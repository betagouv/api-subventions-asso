export type DemarchesSimplifieesSchemaSeedLine =
    | { to: string; possibleLabels: string[] }
    | { to: string; valueToPrompt: boolean }
    | { to: string; value: string }
    | { to: string; from: string };

export type DemarchesSimplifieesSchemaSeed = {
    schema: DemarchesSimplifieesSchemaSeedLine[];
    commonSchema: DemarchesSimplifieesSchemaSeedLine[];
};
