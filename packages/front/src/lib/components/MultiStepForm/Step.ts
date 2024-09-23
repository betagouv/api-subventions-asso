import { SvelteComponent } from "svelte";

export type Step = {
    name: string;
    component: typeof SvelteComponent;
    alert: typeof SvelteComponent;
    needsValidation: boolean;
};
