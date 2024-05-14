import type { BadgeOption } from "$lib/dsfr/Badge.types";

export const getStatusBadgeOptions = (estab): Partial<BadgeOption> | null => {
    if (!Object.hasOwn(estab, "ouvert")) return null;
    return estab.ouvert ? { label: "Ouvert", type: "success" } : { label: "Fermé", type: "error" };
};
