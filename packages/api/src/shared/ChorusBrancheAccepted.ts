import { DefaultObject } from "../@types/utils";

export const BRANCHE_ACCEPTED: DefaultObject<boolean> = {
    Z004: true,
    Z007: true,
    Z040: true,
    Z041: true,
    Z044: true,
    Z039: true,
};

// it happens that we have fondations funded with this branch, see #3453
export const ASSO_BRANCHE = "Z039";
