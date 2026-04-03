export type DemarchesSimplifieesSchemaSeedLine =
    | { to: string; possibleLabels: string[] }
    | { to: string; valueToPrompt: boolean }
    | { to: string; value: string | number }
    | { to: string; from: string };

export type DemarchesSimplifieesSchemaSeed = {
    schema: DemarchesSimplifieesSchemaSeedLine[];
    commonSchema: DemarchesSimplifieesSchemaSeedLine[];
    flatSchema: DemarchesSimplifieesSchemaSeedLine[];
};
