import type { Component } from "svelte";

export type Step = {
    name: string;
    component: Component;
    alert: Component;
    needsValidation: boolean;
};
