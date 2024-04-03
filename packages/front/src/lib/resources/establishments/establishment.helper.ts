export const getStatusBadgeOptions = estab => {
    if (!Object.hasOwn(estab, "ouvert")) return null;
    return estab.ouvert ? { label: "Ouvert", type: "success" } : { label: "Fermé", type: "error" };
};
